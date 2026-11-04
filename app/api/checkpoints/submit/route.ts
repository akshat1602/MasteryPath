import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import { calculateNextReview } from '@/lib/algorithms/sm2';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const {
      userId,
      topicId,
      checkpointType, // 'recall_explanation' | 'transfer_problem'
      score,          // e.g., 0 to 100
      userSubmission,
      passed,         // boolean
      grade,          // 0 to 5 rating scale for SM-2
    } = body;

    if (!userId || !topicId || grade === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: userId, topicId, or grade' },
        { status: 400 }
      );
    }

    // 1. Insert immutable record into checkpoint_attempts
    const { error: attemptError } = await supabase
      .from('checkpoint_attempts')
      .insert({
        user_id: userId,
        topic_id: topicId,
        checkpoint_type: checkpointType || 'transfer_problem',
        score: score ?? (passed ? 100 : 0),
        user_submission: userSubmission || '',
        passed: Boolean(passed),
      });

    if (attemptError) throw attemptError;

    // 2. Retrieve existing mastery record (if any)
    const { data: existingMastery, error: fetchError } = await supabase
      .from('user_topic_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // PGRST116 = no rows found (expected for a first attempt)
      throw fetchError;
    }

    const currentInterval = existingMastery?.interval_days ?? 0;
    const currentEaseFactor = existingMastery?.ease_factor ? Number(existingMastery.ease_factor) : 2.5;
    const consecutiveSuccesses = existingMastery?.consecutive_successes ?? 0;
    
    // Calculate Transfer Gap (Recall % - Transfer %)
    const currentRecall = existingMastery?.recall_score ? Number(existingMastery.recall_score) : 0;
    const currentTransfer = existingMastery?.transfer_score ? Number(existingMastery.transfer_score) : 0;
    const transferGap = Math.max(0, currentRecall - currentTransfer);

    // 3. Compute updated spaced repetition schedule
    const sm2Result = calculateNextReview({
      currentInterval,
      currentEaseFactor,
      consecutiveSuccesses,
      grade,
      transferGap,
    });

    // 4. Upsert updated mastery snapshot
    const updatedRecall = checkpointType === 'recall_explanation' ? score : currentRecall;
    const updatedTransfer = checkpointType === 'transfer_problem' ? score : currentTransfer;
    const updatedGap = Math.max(0, updatedRecall - updatedTransfer);

    const { data: savedMastery, error: upsertError } = await supabase
      .from('user_topic_mastery')
      .upsert(
        {
          user_id: userId,
          topic_id: topicId,
          recall_score: updatedRecall,
          transfer_score: updatedTransfer,
          transfer_gap: updatedGap,
          ease_factor: sm2Result.nextEaseFactor,
          interval_days: sm2Result.nextInterval,
          consecutive_successes: sm2Result.consecutiveSuccesses, // Corrected snake_case
          last_reviewed_at: new Date().toISOString(),
          next_review_at: sm2Result.nextReviewDate.toISOString(),
        },
        { onConflict: 'user_id,topic_id' }
      )
      .select()
      .single();

    if (upsertError) throw upsertError;

    return NextResponse.json({
      success: true,
      message: 'Checkpoint recorded and retention schedule updated',
      mastery: savedMastery,
    });
  } catch (error: any) {
    console.error('Error submitting checkpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
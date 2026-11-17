import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { calculateNextReview } from '@/lib/algorithms/sm2';

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() {
            return cookieStore.getAll();
          },
          setAll(cookiesToSet) {
            try {
              cookiesToSet.forEach(({ name, value, options }) =>
                cookieStore.set(name, value, options)
              );
            } catch {
              // Ignore in route handlers
            }
          },
        },
      }
    );

    // 1. Enforce Server-Side Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }
    const userId = user.id;

    const body = await request.json();
    const {
      topicId,
      checkpointType = 'transfer_problem',
      score = 0,
      passed,
      grade,
      studentAnswer,
      problemStatement,
      expectedApproach,
      difficulty,
      strengths,
      missingConcepts,
      feedback,
      nextSteps,
      verdict,
      testCaseSummary,
      attemptNumber = 1,
      solvingTime,
      hintUsage = 0
    } = body;

    if (!topicId || grade === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields: topicId or grade' },
        { status: 400 }
      );
    }

    // 2. Insert immutable record into checkpoint_attempts
    const { error: attemptError } = await supabase
      .from('checkpoint_attempts')
      .insert({
        user_id: userId,
        topic_id: topicId,
        checkpoint_type: checkpointType,
        score,
        user_submission: studentAnswer || '',
        passed: Boolean(passed),
        problem_statement: problemStatement || null,
        expected_approach: expectedApproach || null,
        difficulty: difficulty || null,
        strengths: strengths || null,
        missing_concepts: missingConcepts || null,
        feedback: feedback || null,
        next_steps: nextSteps || null,
        verdict: verdict || null,
        test_case_summary: testCaseSummary || null,
        attempt_number: attemptNumber,
        solving_time: solvingTime || null,
        hint_usage: hintUsage,
      });

    if (attemptError) throw attemptError;

    // 3. Retrieve and calculate SM-2 mastery
    const { data: existingMastery, error: fetchError } = await supabase
      .from('user_topic_mastery')
      .select('*')
      .eq('user_id', userId)
      .eq('topic_id', topicId)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      throw fetchError;
    }

    const currentInterval = existingMastery?.interval_days ?? 0;
    const currentEaseFactor = existingMastery?.ease_factor ? Number(existingMastery.ease_factor) : 2.5;
    const consecutiveSuccesses = existingMastery?.consecutive_successes ?? 0;
    const currentRecall = existingMastery?.recall_score ? Number(existingMastery.recall_score) : 0;
    const currentTransfer = existingMastery?.transfer_score ? Number(existingMastery.transfer_score) : 0;
    const transferGap = Math.max(0, currentRecall - currentTransfer);

    const sm2Result = calculateNextReview({
      currentInterval,
      currentEaseFactor,
      consecutiveSuccesses,
      grade,
      transferGap,
    });

    const updatedRecall = checkpointType === 'recall_explanation' ? score : currentRecall;
    const updatedTransfer = checkpointType === 'transfer_problem' ? score : currentTransfer;
    const updatedGap = Math.max(0, updatedRecall - updatedTransfer);

    // 4. Upsert updated mastery snapshot
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
          consecutive_successes: sm2Result.consecutiveSuccesses,
          last_reviewed_at: new Date().toISOString(),
          next_review_at: sm2Result.nextReviewDate.toISOString(),
        },
        { onConflict: 'user_id,topic_id' }
      )
      .select()
      .single();

    if (upsertError) throw upsertError;

    // 5. Return the exact API Contract Alfee requested
    return NextResponse.json({
      success: true,
      score,
      strengths,
      missingConcepts,
      feedback,
      nextSteps,
      mastery: savedMastery,
    });
  } catch (error: any) {
    console.error('Error submitting checkpoint:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
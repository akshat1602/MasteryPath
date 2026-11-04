import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// We instantiate the client directly here to avoid import alias errors
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // We must use the service role key to bypass RLS policies during bulk ingestion
);

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { topics } = body; 

    if (!topics || !Array.isArray(topics)) {
      return NextResponse.json({ error: 'Invalid payload: expected an array of topics' }, { status: 400 });
    }

    // Step 1: Insert topics
    const { data: insertedTopics, error: topicError } = await supabase
      .from('topics')
      .upsert(
        topics.map((t: any) => ({
          slug: t.slug,
          title: t.title,
          description: t.description,
          estimated_minutes: t.estimated_minutes || 30,
          pattern_key: t.pattern_key || null
        })),
        { onConflict: 'slug' } 
      )
      .select('id, slug'); 

    if (topicError) throw topicError;

    if (!insertedTopics || insertedTopics.length === 0) {
        return NextResponse.json({ message: 'No topics inserted' }, { status: 200 });
    }

    // Step 2: Build the Prerequisite Map
    const slugToIdMap = new Map(insertedTopics.map(t => [t.slug, t.id]));
    const edgesToInsert: { topic_id: string; prerequisite_id: string }[] = [];
    
    topics.forEach((t: any) => {
      if (t.prerequisites && Array.isArray(t.prerequisites)) {
        const currentTopicId = slugToIdMap.get(t.slug);
        t.prerequisites.forEach((prereqSlug: string) => {
          const prereqId = slugToIdMap.get(prereqSlug);
          if (currentTopicId && prereqId) {
            edgesToInsert.push({
              topic_id: currentTopicId,
              prerequisite_id: prereqId
            });
          }
        });
      }
    });

    // Step 3: Insert Prerequisite Edges
    if (edgesToInsert.length > 0) {
      const { error: edgeError } = await supabase
        .from('topic_prerequisites')
        .upsert(edgesToInsert, { onConflict: 'topic_id, prerequisite_id' }); 

      if (edgeError) throw edgeError;
    }

    return NextResponse.json({ 
      message: 'Graph ingestion complete', 
      topicsInserted: insertedTopics.length,
      edgesInserted: edgesToInsert.length 
    }, { status: 200 });

  } catch (error: any) {
    console.error("Ingestion Error:", error);
    return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
  }
}
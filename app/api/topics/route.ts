import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';
import { createClient } from '@supabase/supabase-js';

// Admin client strictly for fetching the global graph structure
const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    const cookieStore = await cookies();
    
    // Auth client to securely verify who is requesting the graph
    const supabaseAuth = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {}, 
        },
      }
    );

    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    // 1. Fetch global topics (nodes) and prerequisites (edges)
    const { data: topics, error: topicsError } = await supabaseAdmin
      .from('topics')
      .select('id, slug, title, description, estimated_minutes, pattern_key');

    if (topicsError) throw topicsError;

    const { data: edges, error: edgesError } = await supabaseAdmin
      .from('topic_prerequisites')
      .select('topic_id, prerequisite_id');

    if (edgesError) throw edgesError;

    // 2. Fetch the logged-in user's specific SM-2 mastery data
    const { data: masteryData, error: masteryError } = await supabaseAdmin
      .from('user_topic_mastery')
      .select('*')
      .eq('user_id', user.id);

    if (masteryError) throw masteryError;

    // Create a lookup map for fast O(1) merging: topic_id -> mastery_record
    const masteryMap = new Map(masteryData?.map(m => [m.topic_id, m]));

    // 3. Format nodes for React Flow and inject the exact keys Alfee expects
    const nodes = topics.map((topic, index) => {
      const userMastery = masteryMap.get(topic.id);
      
      // Default to Alfee's 'pending' string for locked nodes
      let nodeStatus = 'pending'; 
      
      if (userMastery) {
         const isMastered = Number(userMastery.transfer_score) >= 80;
         const isDecaying = Number(userMastery.transfer_gap) > 25;
         
         if (isMastered && !isDecaying) {
             nodeStatus = 'mastered';
         } else if (isDecaying) {
             nodeStatus = 'decaying';
         } else {
             nodeStatus = 'ready'; // Matches her active/learning state
         }
      } else {
         // Automatically unlock the first node in the graph so the user can start
         if (topic.slug === 'arrays-hashing') {
             nodeStatus = 'ready';
         }
      }

      return {
        id: topic.id,
        data: {
          label: topic.title,
          slug: topic.slug,
          description: topic.description,
          estimatedMinutes: topic.estimated_minutes,
          // Guarantee the status key perfectly matches her UI dictionary
          status: nodeStatus, 
          transferScore: userMastery ? Number(userMastery.transfer_score) : 0,
          retention: userMastery ? Number(userMastery.recall_score) : 0,
          transferGap: userMastery ? Number(userMastery.transfer_gap) : 0,
          nextReviewAt: userMastery ? userMastery.next_review_at : null,
        },
        // Basic static positioning (Dagre/ELK handles auto-layout on frontend)
        position: { x: (index % 3) * 250, y: Math.floor(index / 3) * 150 },
      };
    });

    // 4. Format edges for React Flow
    const formattedEdges = edges.map((edge) => ({
      id: `e-${edge.prerequisite_id}-${edge.topic_id}`,
      source: edge.prerequisite_id,
      target: edge.topic_id,
      animated: true, 
    }));

    return NextResponse.json({ nodes, edges: formattedEdges }, { status: 200 });
  } catch (error: any) {
    console.error("Topics Fetch Error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
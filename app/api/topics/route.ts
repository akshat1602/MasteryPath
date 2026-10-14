import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function GET() {
  try {
    // 1. Fetch all topics (nodes)
    const { data: topics, error: topicsError } = await supabase
      .from('topics')
      .select('id, slug, title, description, estimated_minutes, pattern_key');

    if (topicsError) throw topicsError;

    // 2. Fetch all prerequisites (edges)
    const { data: edges, error: edgesError } = await supabase
      .from('topic_prerequisites')
      .select('topic_id, prerequisite_id');

    if (edgesError) throw edgesError;

    // 3. Format as nodes and edges for React Flow
    const nodes = topics.map((topic, index) => ({
      id: topic.id,
      data: {
        label: topic.title,
        slug: topic.slug,
        description: topic.description,
        estimatedMinutes: topic.estimated_minutes,
      },
      // Basic initial positioning so nodes don't overlap before layout engines run
      position: { x: (index % 3) * 220, y: Math.floor(index / 3) * 120 },
    }));

    const formattedEdges = edges.map((edge) => ({
      id: `e-${edge.prerequisite_id}-${edge.topic_id}`,
      source: edge.prerequisite_id,
      target: edge.topic_id,
      animated: true,
    }));

    return NextResponse.json({ nodes, edges: formattedEdges }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
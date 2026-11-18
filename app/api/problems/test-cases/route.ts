import { NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function GET(request: Request) {
  try {
    const cookieStore = await cookies();
    
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll(); },
          setAll() {}, 
        },
      }
    );

    // Enforce Authentication
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized: Invalid session' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const problemId = searchParams.get('problemId');

    if (!problemId) {
      return NextResponse.json(
        { error: 'Missing required parameter: problemId' },
        { status: 400 }
      );
    }

    // Securely fetch ONLY the test_cases column
    const { data: problemData, error: dbError } = await supabase
      .from('generated_problems')
      .select('test_cases')
      .eq('id', problemId)
      .single();

    if (dbError) throw dbError;

    return NextResponse.json({
      success: true,
      testCases: problemData.test_cases
    });

  } catch (error: any) {
    console.error('Error fetching test cases:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
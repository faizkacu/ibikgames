import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET() {
  const results: Record<string, unknown> = {
    timestamp: new Date().toISOString(),
    env: {
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL
        ? 'SET'
        : 'MISSING',
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
        ? 'SET'
        : 'MISSING',
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL ?? 'MISSING',
    },
  };

  // Test Supabase connection
  try {
    const { createClient } = await import('@/lib/supabase/server');
    const supabase = await createClient();
    results.supabaseClient = 'OK';

    const { data: authData, error: authError } =
      await supabase.auth.getUser();
    results.auth = {
      user: authData.user ? authData.user.email : 'NOT_AUTHENTICATED',
      error: authError?.message ?? null,
    };

    // Test a simple query
    const { data, error, count } = await supabase
      .from('quizzes')
      .select('*', { count: 'exact', head: true });

    results.database = {
      quizCount: count,
      error: error?.message ?? null,
    };
  } catch (err) {
    results.error = err instanceof Error ? err.message : String(err);
    results.errorStack =
      err instanceof Error ? err.stack?.split('\n').slice(0, 5) : null;
  }

  return NextResponse.json(results, { status: 200 });
}

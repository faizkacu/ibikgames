import { createClient } from '@/lib/supabase/server';

export const dynamic = 'force-dynamic';

export default async function TestPage() {
  const steps: string[] = [];

  try {
    steps.push('1. createClient() start');
    const supabase = await createClient();
    steps.push('2. createClient() OK');

    steps.push('3. getUser() start');
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    steps.push(`4. getUser() OK — user: ${user ? user.email : 'null'}, error: ${authError?.message ?? 'none'}`);

    if (user) {
      steps.push('5. query quizzes start');
      const { data, error: dbError, count } = await supabase
        .from('quizzes')
        .select('*', { count: 'exact' })
        .eq('creator_id', user.id)
        .limit(1);
      steps.push(`6. query OK — count: ${count}, error: ${dbError?.message ?? 'none'}, data: ${JSON.stringify(data)}`);
    }
  } catch (err) {
    steps.push(`ERROR: ${err instanceof Error ? err.message : String(err)}`);
  }

  return (
    <div style={{ padding: 24, fontFamily: 'monospace' }}>
      <h1 style={{ fontSize: 20, fontWeight: 'bold', marginBottom: 16 }}>
        Diagnostic Test Page
      </h1>
      <pre style={{ background: '#f5f5f5', padding: 16, borderRadius: 8 }}>
        {steps.join('\n')}
      </pre>
    </div>
  );
}

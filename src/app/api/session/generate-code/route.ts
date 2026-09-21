import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function POST() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Generate unique code
    const { data: code, error } = await supabase.rpc(
      'generate_session_code'
    );

    if (error || !code) {
      return NextResponse.json(
        { error: 'Failed to generate code' },
        { status: 500 }
      );
    }

    return NextResponse.json({ code });
  } catch {
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

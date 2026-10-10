'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';

export default function LogoutButton() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleLogout = async () => {
    setLoading(true);
    const supabase = createClient();
    await supabase.auth.signOut();
    router.replace('/login');
    router.refresh(); // clears cached server data for the old session
  };

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="rounded-full border border-white/10 px-5 py-2 text-sm text-white transition hover:bg-white/10 disabled:opacity-50"
    >
      {loading ? 'Signing out...' : 'Log out'}
    </button>
  );
}
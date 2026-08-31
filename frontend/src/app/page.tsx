'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/dashboard');
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-900 text-teal-400">
      <div className="flex flex-col items-center gap-3">
        <div className="h-10 w-10 border-4 border-teal-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm font-semibold tracking-wide">Loading Drishti-DR Clinical Platform...</p>
      </div>
    </div>
  );
}

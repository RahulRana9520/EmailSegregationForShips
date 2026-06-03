"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();

  useEffect(() => {
    // AuthGuard handles all the actual login UI now.
    // If a user somehow reaches this specific route and they are already logged in,
    // we should just kick them back to the dashboard.
    router.replace('/');
  }, [router]);

  return (
    <div className="flex items-center justify-center h-full">
      <p className="font-bold text-xl animate-pulse">Redirecting to Dashboard...</p>
    </div>
  );
}

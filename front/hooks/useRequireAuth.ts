'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export function useRequireAuth() {
  const router = useRouter();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (!token) {
      router.replace('/login');
      return;
    }

    setIsCheckingAuth(false);
  }, [router]);

  return { isCheckingAuth };
}

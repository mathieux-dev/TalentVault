import { useEffect, useState } from 'react';

export type AuthUser = {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'HR';
  companyId: string;
};

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isMounted) return;

    const checkAuth = () => {
      try {
        const storedId = localStorage.getItem('id');
        const storedEmail = localStorage.getItem('email');
        const storedName = localStorage.getItem('name');
        const storedRole = localStorage.getItem('role');
        const storedCompanyId = localStorage.getItem('companyId');

        if (storedEmail && storedId) {
          setUser({
            id: storedId,
            name: storedName || storedEmail,
            email: storedEmail,
            role: (storedRole as 'Admin' | 'HR') || 'HR',
            companyId: storedCompanyId || '',
          });
        }
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, [isMounted]);

  const logout = () => {
    localStorage.removeItem('id');
    localStorage.removeItem('email');
    localStorage.removeItem('name');
    localStorage.removeItem('role');
    localStorage.removeItem('companyId');
    localStorage.removeItem('token');
    setUser(null);
  };

  return { user, isLoading, logout };
}

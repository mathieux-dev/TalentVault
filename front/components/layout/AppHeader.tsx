'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/Button';
import { useAuth } from '@/hooks/useAuth';
import { branding } from '@/config/branding';

type AppHeaderProps = {
  showBackButton?: boolean;
  backHref?: string;
};

export function AppHeader({ showBackButton = false, backHref = '/' }: AppHeaderProps) {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <header className="border-b-2 border-[color:var(--color-primary)] bg-white shadow-lg">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-3 sm:px-6 sm:py-4">
        <div className="flex items-center gap-3">
          {showBackButton ? (
            <button
              onClick={() => router.push(backHref)}
              className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-semibold transition hover:bg-slate-100 active:scale-95"
              title="Voltar"
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Voltar</span>
            </button>
          ) : null}
          <Link href="/dashboard" className="flex items-center gap-2 hover:opacity-80 transition">
            {branding.logoUrl ? (
              <img 
                src={branding.logoUrl} 
                alt={branding.appName}
                className="h-10 w-10 object-contain rounded-lg flex-shrink-0"
              />
            ) : (
              <div className="h-10 w-10 flex-shrink-0 rounded-lg bg-[color:var(--color-primary)] flex items-center justify-center">
                <span className="text-white font-bold text-sm">{branding.appName.charAt(0)}</span>
              </div>
            )}
            <span className="hidden font-semibold text-slate-900 sm:inline">
              {branding.appName}
            </span>
          </Link>
        </div>

        {user ? (
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="hidden text-right sm:block">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">
                {user.role === 'Admin' ? 'Administrador' : 'Recursos Humanos'}
              </p>
            </div>

            <div className="h-8 w-px bg-slate-200 hidden sm:block"></div>

            <Button
              variant="primary"
              onClick={handleLogout}
              className="inline-flex items-center gap-2 h-9 px-3 py-1 text-sm font-semibold"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              <span className="hidden sm:inline">Sair</span>
            </Button>
          </div>
        ) : null}
      </div>
    </header>
  );
}

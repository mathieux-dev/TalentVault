type BrandLogoDefaultProps = {
  subtitle?: string;
  center?: boolean;
  titleClassName?: string;
};

export function BrandLogoDefault({ subtitle, center = false, titleClassName = '' }: BrandLogoDefaultProps) {
  return (
    <div className={center ? 'text-center' : ''}>
      <div className="mb-3 inline-flex h-10 w-10 items-center justify-center rounded-lg bg-blue-600">
        <svg className="h-6 w-6 text-white" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v1h8v-1zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z" />
        </svg>
      </div>

      <h1 className={`text-2xl font-bold tracking-tight text-slate-900 ${titleClassName}`.trim()}>
        TalentVault
      </h1>

      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}

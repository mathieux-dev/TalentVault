import { branding, hasLogo } from '@/config/branding';

type BrandLogoProps = {
  subtitle?: string;
  center?: boolean;
  titleClassName?: string;
};

export function BrandLogo({ subtitle, center = false, titleClassName = '' }: BrandLogoProps) {
  return (
    <div className={center ? 'text-center' : ''}>
      {hasLogo ? (
        <img
          src={branding.logoUrl}
          alt={branding.appName}
          className={`mb-3 inline-block h-10 w-auto ${center ? '' : ''}`.trim()}
        />
      ) : null}

      <h1 className={`text-2xl font-bold tracking-tight text-slate-900 ${titleClassName}`.trim()}>
        {branding.appName}
      </h1>

      {subtitle ? <p className="mt-1 text-sm text-slate-500">{subtitle}</p> : null}
    </div>
  );
}
export type BrandingConfig = {
  appName: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  initialBackgroundImage: string;
  formBackgroundImage: string;
};

const defaultBranding: BrandingConfig = {
  appName: 'TalentVault',
  logoUrl: '',
  primaryColor: '#2563eb',
  secondaryColor: '#0f172a',
  initialBackgroundImage: '',
  formBackgroundImage: '',
};

export const branding: BrandingConfig = {
  appName: process.env.NEXT_PUBLIC_APP_NAME ?? defaultBranding.appName,
  logoUrl: process.env.NEXT_PUBLIC_LOGO_URL ?? defaultBranding.logoUrl,
  primaryColor: process.env.NEXT_PUBLIC_PRIMARY_COLOR ?? defaultBranding.primaryColor,
  secondaryColor: process.env.NEXT_PUBLIC_SECONDARY_COLOR ?? defaultBranding.secondaryColor,
  initialBackgroundImage:
    process.env.NEXT_PUBLIC_INITIAL_BG_IMAGE_URL ?? defaultBranding.initialBackgroundImage,
  formBackgroundImage: process.env.NEXT_PUBLIC_FORM_BG_IMAGE_URL ?? defaultBranding.formBackgroundImage,
};

export const hasLogo = branding.logoUrl.trim().length > 0;
export const hasInitialBackground = branding.initialBackgroundImage.trim().length > 0;
export const hasFormBackground = branding.formBackgroundImage.trim().length > 0;
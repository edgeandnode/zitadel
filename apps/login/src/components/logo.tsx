type Props = {
  darkSrc?: string;
  lightSrc?: string;
  height?: number;
  width?: number;
};

// Amp: always the Amp logo (the docs header's), whatever logo the branding settings have
export function Logo(_props: Props) {
  return (
    <div className="flex items-center gap-2 text-2xl font-medium">
      <svg aria-hidden="true" className="h-8 w-8" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
        <path fill="url(#amp-logo-a)" d="m16.043 12.857-.434-.871L12 15.619l-3.609-3.633-.434.871L12 21z" />
        <path
          fill="url(#amp-logo-b)"
          d="M19.5 18.107a28 28 0 0 0-1.91-.421L12 6.429 6.41 17.686a28 28 0 0 0-1.91.421L12 3z"
        />
        <defs>
          <linearGradient id="amp-logo-a" x1="12" x2="12" y1="21" y2="14.09" gradientUnits="userSpaceOnUse">
            <stop stopColor="#A238FF" />
            <stop offset="1" stopColor="#6F4CFF" />
          </linearGradient>
          <linearGradient id="amp-logo-b" x1="12" x2="12" y1="18.107" y2="3" gradientUnits="userSpaceOnUse">
            <stop offset=".39" stopColor="#6F4CFF" />
            <stop offset="1" stopColor="#3694FF" />
          </linearGradient>
        </defs>
      </svg>
      Amp
    </div>
  );
}

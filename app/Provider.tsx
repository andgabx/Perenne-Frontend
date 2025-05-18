// app/providers.tsx
'use client';

import { SessionProvider } from 'next-auth/react';

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider
      refetchInterval={60 * 60} // Revalida a cada 1h
      refetchOnWindowFocus={false}
    >
      {children}
    </SessionProvider>
  );
}
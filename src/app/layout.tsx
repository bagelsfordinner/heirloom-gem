// src/app/layout.tsx
'use client'; // The AuthProvider is a client component

import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google';
import './../styles/globals.scss';
import { AuthProvider } from '@/context/AuthContext'; // Import AuthProvider
import { useRouter, usePathname } from 'next/navigation'; // For redirect logic
import { useEffect } from 'react';
import Spinner from '@/components/ui/Spinner/Spinner'; // Your spinner component

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-title',
});

// Metadata is server-only in app router, so it cannot be directly in client components.
// Export it outside the default function.
export const metadata: Metadata = {
  title: 'Heirloom - Digital TTRPG Campaign Manager',
  description: 'Manage your TTRPG campaigns with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const router = useRouter();
  const pathname = usePathname();

  // Basic client-side redirect for unauthorized users
  // This can be further refined with `useAuth` hook inside children or layout components
  useEffect(() => {
    const token = localStorage.getItem('heirloom_jwt_token');
    const publicRoutes = ['/login', '/register'];

    if (!token && !publicRoutes.includes(pathname)) {
      router.push('/login');
    }
  }, [pathname, router]);

  return (
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <div className="app-container">
          <AuthProvider> {/* Wrap your children with AuthProvider */}
            {children}
          </AuthProvider>
        </div>
      </body>
    </html>
  );
}
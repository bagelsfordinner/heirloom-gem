// src/app/layout.tsx
import type { Metadata } from 'next';
import { Montserrat } from 'next/font/google'; // Import Montserrat font
import { Inter } from 'next/font/google';
import './../styles/globals.scss'; // Import your global SCSS file

const montserrat = Montserrat({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-title', // Assign to CSS variable
});


const inter = Inter({
   subsets: ['latin'],
   display: 'swap',
   variable: '--font-body',
 });

export const metadata: Metadata = {
  title: 'Heirloom - Digital TTRPG Campaign Manager',
  description: 'Manage your TTRPG campaigns with ease.',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // Apply font variables to HTML tag. Use a class for dark mode theme.
    <html lang="en" className={`${montserrat.variable}`}>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
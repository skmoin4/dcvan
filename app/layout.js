import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import '../src/index.css';
import AppShell from '../src/components/common/AppShell';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://dcvan.magnusideas.com';

const bodyFont = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const displayFont = Plus_Jakarta_Sans({
  subsets: ['latin'],
  weight: ['500', '600', '700', '800'],
  variable: '--font-display',
  display: 'swap',
});

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: 'Swaraj Infra Services | Drainage, Septic Tank & Industrial Cleaning',
  description: 'Book professional drainage cleaning, septic tank cleaning, suction van, and industrial cleaning services with Swaraj Infra Services.',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/brand-assets/logo.png',
    apple: '/brand-assets/logo.png',
  },
  openGraph: {
    title: 'Swaraj Infra Services | Drainage, Septic Tank & Industrial Cleaning',
    description: 'Fast drainage, septic tank, suction van, and industrial cleaning service at your location.',
    url: siteUrl,
    siteName: 'Swaraj Infra Services',
    type: 'website',
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

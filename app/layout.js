import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import '../src/index.css';
import AppShell from '../src/components/common/AppShell';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.swarajin.com';

const title = 'Swaraj Infra Services | Drainage, Septic Tank & Industrial Cleaning';
const description = 'Book professional drainage cleaning, septic tank cleaning, suction van, and industrial cleaning services with Swaraj Infra Services. Fast callback, trained field teams, 24/7 emergency response.';
const keywords = [
  'drainage cleaning',
  'septic tank cleaning',
  'sewage suction van',
  'suction van service',
  'industrial cleaning service',
  'high pressure jetting',
  'drain blockage removal',
  'septic tank emptying',
  'sewer line cleaning',
  'sludge removal service',
  'emergency drainage cleaning',
  'Swaraj Infra Services',
];

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
  title: {
    default: title,
    template: '%s | Swaraj Infra Services',
  },
  description,
  keywords,
  applicationName: 'Swaraj Infra Services',
  authors: [{ name: 'Swaraj Infra Services' }],
  creator: 'Swaraj Infra Services',
  publisher: 'Swaraj Infra Services',
  category: 'Home Services',
  alternates: {
    canonical: '/',
  },
  icons: {
    icon: '/brand-assets/logo.png',
    apple: '/brand-assets/logo.png',
    shortcut: '/brand-assets/logo.png',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-image-preview': 'large',
      'max-snippet': -1,
      'max-video-preview': -1,
    },
  },
  openGraph: {
    title,
    description,
    url: siteUrl,
    siteName: 'Swaraj Infra Services',
    type: 'website',
    locale: 'en_IN',
    images: [
      {
        url: '/brand-assets/logo.png',
        width: 400,
        height: 400,
        alt: 'Swaraj Infra Services',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title,
    description,
    images: ['/brand-assets/logo.png'],
  },
};

export const viewport = {
  width: 'device-width',
  initialScale: 1,
  themeColor: '#0a1a3d',
};

const structuredData = {
  '@context': 'https://schema.org',
  '@type': 'HomeAndConstructionBusiness',
  name: 'Swaraj Infra Services',
  description,
  url: siteUrl,
  image: `${siteUrl}/brand-assets/logo.png`,
  telephone: ['+919823703702', '+919657703702'],
  priceRange: '$$',
  areaServed: 'IN',
  openingHoursSpecification: {
    '@type': 'OpeningHoursSpecification',
    dayOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'],
    opens: '00:00',
    closes: '23:59',
  },
  makesOffer: [
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Drainage Line Cleaning' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Septic Tank Cleaning' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'Industrial Cleaning' } },
    { '@type': 'Offer', itemOffered: { '@type': 'Service', name: 'High Pressure Jetting' } },
  ],
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${bodyFont.variable} ${displayFont.variable}`}>
      <head>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body suppressHydrationWarning>
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}

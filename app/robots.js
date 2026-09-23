const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://swarajin.com';

export default function robots() {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/login', '/admin', '/admin/*', '/driver', '/driver/*', '/unauthorized'],
      },
    ],
    sitemap: `${siteUrl}/sitemap.xml`,
  };
}

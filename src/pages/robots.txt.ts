import type { APIRoute } from 'astro';

const getRobotsTxt = (sitemapURL: string) => `
User-agent: *
Allow: /
Disallow: /keystatic
Disallow: /api/

Sitemap: ${sitemapURL}
`;

export const GET: APIRoute = ({ site }) => {
  const sitemapURL = new URL(
    'sitemap-index.xml',
    site ?? 'https://swift-holdings.pages.dev'
  );
  return new Response(getRobotsTxt(sitemapURL.href), {
    headers: { 'Content-Type': 'text/plain; charset=utf-8' },
  });
};

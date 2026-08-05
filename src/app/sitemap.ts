import { MetadataRoute } from 'next';
import { PRODUCTS } from '@/data/products';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://technkt.in';

  // Static routes
  const staticRoutes = [
    '',
    '/terms',
    '/refund',
    '/privacy',
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: 'daily' as const,
    priority: route === '' ? 1.0 : 0.5,
  }));

  // Dynamic product routes
  const productRoutes = PRODUCTS.map((product) => ({
    url: `${baseUrl}/${product.slug}`,
    lastModified: new Date(),
    changeFrequency: 'weekly' as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...productRoutes];
}

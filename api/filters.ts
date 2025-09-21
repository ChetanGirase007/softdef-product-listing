import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Enable CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader(
    'Access-Control-Allow-Headers',
    'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version'
  );

  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method === 'GET') {
    try {
      const { products } = await storage.getProducts();
      
      const brands = Array.from(new Set(products.map(p => p.brand)));
      const categories = Array.from(new Set(products.map(p => p.category)));
      const colors = Array.from(new Set(products.flatMap(p => p.colors)));
      
      // Get brand counts
      const brandCounts = brands.reduce((acc, brand) => {
        acc[brand] = products.filter(p => p.brand === brand).length;
        return acc;
      }, {} as Record<string, number>);

      res.json({
        brands: brandCounts,
        categories,
        colors,
      });
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
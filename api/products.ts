import { VercelRequest, VercelResponse } from '@vercel/node';
import { storage } from '../server/storage';
import { z } from 'zod';

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
      const querySchema = z.object({
        category: z.string().optional(),
        brand: z.string().optional().transform(val => val ? val.split(',') : undefined),
        colors: z.string().optional().transform(val => val ? val.split(',') : undefined),
        minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
        maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
        sortBy: z.enum(['name-asc', 'name-desc', 'price-asc', 'price-desc', 'popularity-desc']).optional(),
        page: z.string().optional().transform(val => val ? parseInt(val) : 1),
        limit: z.string().optional().transform(val => val ? parseInt(val) : 12),
      });

      const filters = querySchema.parse(req.query);
      const result = await storage.getProducts(filters);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  } else {
    res.status(405).json({ message: 'Method not allowed' });
  }
}
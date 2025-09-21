import { promises as fs } from 'fs';
import path from 'path';
import { z } from 'zod';
import type { Product } from '@shared/schema';

// Define a handler function for Netlify
export async function handler(event: { httpMethod: string; queryStringParameters: any; }) {
  if (event.httpMethod === 'OPTIONS') {
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET,OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type',
      },
    };
  }

  if (event.httpMethod === 'GET') {
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

      const filters = querySchema.parse(event.queryStringParameters);

      // Read products from the JSON file
      const jsonPath = path.resolve(process.cwd(), 'api', 'products.json');
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      let products: Product[] = JSON.parse(jsonData);

      // Apply filters
      if (filters?.category) {
        products = products.filter(p => p.category === filters.category);
      }
      if (filters?.brand && filters.brand.length > 0) {
        products = products.filter(p => filters.brand!.includes(p.brand));
      }
      if (filters?.colors && filters.colors.length > 0) {
        products = products.filter(p => 
          filters.colors!.some(color => p.colors.includes(color))
        );
      }
      if (filters?.minPrice !== undefined) {
        products = products.filter(p => 
          parseFloat(p.discountPrice || p.price) >= filters.minPrice!
        );
      }
      if (filters?.maxPrice !== undefined) {
        products = products.filter(p => 
          parseFloat(p.discountPrice || p.price) <= filters.maxPrice!
        );
      }

      // Apply sorting
      if (filters?.sortBy) {
        switch (filters.sortBy) {
          case 'name-asc':
            products.sort((a, b) => a.name.localeCompare(b.name));
            break;
          case 'name-desc':
            products.sort((a, b) => b.name.localeCompare(a.name));
            break;
          case 'price-asc':
            products.sort((a, b) => 
              parseFloat(a.discountPrice || a.price) - parseFloat(b.discountPrice || b.price)
            );
            break;
          case 'price-desc':
            products.sort((a, b) => 
              parseFloat(b.discountPrice || b.price) - parseFloat(a.discountPrice || a.price)
            );
            break;
          case 'popularity-desc':
            products.sort((a, b) => b.ratingCount - a.ratingCount);
            break;
        }
      }

      const total = products.length;
      
      // Apply pagination
      const page = filters?.page || 1;
      const limit = filters?.limit || 12;
      const startIndex = (page - 1) * limit;
      const endIndex = startIndex + limit;
      
      products = products.slice(startIndex, endIndex);

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ products, total }),
      };

    } catch (error) {
      return {
        statusCode: 400,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Invalid query parameters" }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Method not allowed' }),
  };
}

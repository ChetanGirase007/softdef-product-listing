import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@shared/schema';

// Define a handler function for Netlify
export async function handler(event: { httpMethod: string; }) {
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
      // Read products from the JSON file
      const jsonPath = path.resolve(process.cwd(), 'api', 'products.json');
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      const products: Product[] = JSON.parse(jsonData);

      // Calculate filters
      const brands = new Map<string, number>();
      const colors = new Map<string, number>();

      for (const product of products) {
        // Count brands
        if (product.brand) {
          brands.set(product.brand, (brands.get(product.brand) || 0) + 1);
        }

        // Count colors
        if (product.colors && Array.isArray(product.colors)) {
          for (const color of product.colors) {
            colors.set(color, (colors.get(color) || 0) + 1);
          }
        }
      }

      const filterData = {
        brands: Array.from(brands.entries()).map(([name, count]) => ({ name, count })),
        colors: Array.from(colors.entries()).map(([name, count]) => ({ name, count })),
      };

      return {
        statusCode: 200,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(filterData),
      };

    } catch (error) {
      return {
        statusCode: 500,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: "Error reading product data" }),
      };
    }
  }

  return {
    statusCode: 405,
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: 'Method not allowed' }),
  };
}

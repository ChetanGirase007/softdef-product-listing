import { promises as fs } from 'fs';
import path from 'path';
import type { Product } from '@shared/schema';

// Define a handler function for Netlify
export async function handler(event: { httpMethod: string; path: string; }) {

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
      const id = event.path.split('/').pop();

      if (!id) {
        return {
          statusCode: 400,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Product ID is required" }),
        };
      }

      const jsonPath = path.resolve(process.cwd(), 'api', 'products.json');
      const jsonData = await fs.readFile(jsonPath, 'utf-8');
      const products: Product[] = JSON.parse(jsonData);
      
      const product = products.find(p => p.id === id);

      if (product) {
        return {
          statusCode: 200,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(product),
        };
      } else {
        return {
          statusCode: 404,
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ message: "Product not found" }),
        };
      }
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

import type { Express } from "express";
import { createServer, type Server } from "http";
import { promises as fs } from 'fs';
import path from 'path';
import { z } from "zod";
import type { Product } from "@shared/schema";

export async function registerRoutes(app: Express): Promise<Server> {

  const getProductsFromFile = async () => {
    // In production (Vercel), _products.json will be in the dist directory
    let jsonPath;
    if (process.env.NODE_ENV === 'production') {
      jsonPath = path.join(process.cwd(), '_products.json');
    } else {
      jsonPath = path.join(process.cwd(), 'server', '_products.json');
    }
    const jsonData = await fs.readFile(jsonPath, 'utf-8');
    return JSON.parse(jsonData) as Product[];
  };

  // Get products with filters
  app.get("/api/products", async (req, res) => {
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
      let products = await getProductsFromFile();

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
      
      const paginatedProducts = products.slice(startIndex, endIndex);

      res.json({ products: paginatedProducts, total });

    } catch (error) {
      // FIX: Improved error handling
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid query parameters", errors: error.errors });
      }
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const products = await getProductsFromFile();
      const product = products.find(p => p.id === req.params.id);

      if (!product) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  // Get brands and categories for filters
  app.get("/api/filters", async (req, res) => {
    try {
      const products = await getProductsFromFile();
      
      const brands = new Map<string, number>();
      const colors = new Map<string, number>();

      for (const product of products) {
        if (product.brand) {
          brands.set(product.brand, (brands.get(product.brand) || 0) + 1);
        }
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
      
      res.json(filterData);
    } catch (error) {
      res.status(500).json({ message: "Internal server error" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

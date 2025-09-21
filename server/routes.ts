import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
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
      const result = await storage.getProducts(filters);
      
      res.json(result);
    } catch (error) {
      res.status(400).json({ message: "Invalid query parameters" });
    }
  });

  // Get single product
  app.get("/api/products/:id", async (req, res) => {
    try {
      const product = await storage.getProductById(req.params.id);
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
  });

  const httpServer = createServer(app);
  return httpServer;
}

import { z } from "zod";
import { promises as fs } from "fs";
import path from "path";
import type { Handler } from "@netlify/functions";
import type { Product } from "../../shared/schema";

const getProductsFromFile = async () => {
  // Use a path relative to the function file for serverless compatibility
  const jsonPath = path.join(__dirname, "_products.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  return JSON.parse(jsonData) as Product[];
};

const querySchema = z.object({
  category: z.string().optional(),
  brand: z.string().optional().transform(val => val ? val.split(",") : undefined),
  colors: z.string().optional().transform(val => val ? val.split(",") : undefined),
  minPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  maxPrice: z.string().optional().transform(val => val ? parseFloat(val) : undefined),
  sortBy: z.enum(["name-asc", "name-desc", "price-asc", "price-desc", "popularity-desc"]).optional(),
  page: z.string().optional().transform(val => val ? parseInt(val) : 1),
  limit: z.string().optional().transform(val => val ? parseInt(val) : 12),
});

const handler: Handler = async (event) => {
  try {
    const filters = querySchema.parse(event.queryStringParameters || {});
    let products = await getProductsFromFile();

    if (filters?.category) {
      products = products.filter(p => p.category === filters.category);
    }
    if (filters?.brand && filters.brand.length > 0) {
      products = products.filter(p => filters.brand!.includes(p.brand));
    }
    if (filters?.colors && filters.colors.length > 0) {
      products = products.filter(p => filters.colors!.some(color => p.colors.includes(color)));
    }
    if (filters?.minPrice !== undefined) {
      products = products.filter(p => parseFloat(p.discountPrice || p.price) >= filters.minPrice!);
    }
    if (filters?.maxPrice !== undefined) {
      products = products.filter(p => parseFloat(p.discountPrice || p.price) <= filters.maxPrice!);
    }

    if (filters?.sortBy) {
      switch (filters.sortBy) {
        case "name-asc":
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case "name-desc":
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case "price-asc":
          products.sort((a, b) => parseFloat(a.discountPrice || a.price) - parseFloat(b.discountPrice || b.price));
          break;
        case "price-desc":
          products.sort((a, b) => parseFloat(b.discountPrice || b.price) - parseFloat(a.discountPrice || a.price));
          break;
        case "popularity-desc":
          products.sort((a, b) => b.ratingCount - a.ratingCount);
          break;
      }
    }

    const total = products.length;
    const page = filters?.page || 1;
    const limit = filters?.limit || 12;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = products.slice(startIndex, endIndex);

    return {
      statusCode: 200,
      body: JSON.stringify({ products: paginatedProducts, total }),
    };
  } catch (error: any) {
    if (error instanceof z.ZodError) {
      return {
        statusCode: 400,
        body: JSON.stringify({ message: "Invalid query parameters", errors: error.errors }),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

export { handler };

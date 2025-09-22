import { promises as fs } from "fs";
import path from "path";
import type { Handler } from "@netlify/functions";
import type { Product } from "../../shared/schema";

const getProductsFromFile = async () => {
  const jsonPath = path.join(process.cwd(), "server", "_products.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  return JSON.parse(jsonData) as Product[];
};

const handler: Handler = async () => {
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
    return {
      statusCode: 200,
      body: JSON.stringify(filterData),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

export { handler };

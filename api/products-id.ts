import { promises as fs } from "fs";
import path from "path";
import type { Handler } from "@netlify/functions";
import type { Product } from "../../shared/schema";

const getProductsFromFile = async () => {
  const jsonPath = path.join(process.cwd(), "server", "_products.json");
  const jsonData = await fs.readFile(jsonPath, "utf-8");
  return JSON.parse(jsonData) as Product[];
};

const handler: Handler = async (event) => {
  try {
    const id = event.path.split("/").pop();
    const products = await getProductsFromFile();
    const product = products.find(p => p.id === id);
    if (!product) {
      return {
        statusCode: 404,
        body: JSON.stringify({ message: "Product not found" }),
      };
    }
    return {
      statusCode: 200,
      body: JSON.stringify(product),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ message: "Internal server error" }),
    };
  }
};

export { handler };

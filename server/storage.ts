import { type User, type InsertUser, type Product, type InsertProduct } from "@shared/schema";
import { randomUUID } from "crypto";

export interface IStorage {
  getUser(id: string): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  getProducts(filters?: {
    category?: string;
    brand?: string;
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'popularity-desc';
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }>;
  getProductById(id: string): Promise<Product | undefined>;
  createProduct(product: InsertProduct): Promise<Product>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User>;
  private products: Map<string, Product>;

  constructor() {
    this.users = new Map();
    this.products = new Map();
    this.initializeProducts();
  }

  private initializeProducts() {
    const sampleProducts: InsertProduct[] = [
      {
        name: "Nike Air Max 270 React",
        price: "8999",
        discountPrice: "6299",
        discountPercent: 30,
        ratingValue: "4.0",
        ratingCount: 128,
        isHot: true,
        colors: ["blue", "red", "black"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Nike Air Max 270 React Sport",
        price: "7999",
        discountPrice: "5799",
        discountPercent: 28,
        ratingValue: "5.0",
        ratingCount: 92,
        isHot: true,
        colors: ["red", "black", "white"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Nike Air Max 270 React Classic",
        price: "9999",
        discountPrice: "7299",
        discountPercent: 27,
        ratingValue: "4.0",
        ratingCount: 76,
        isHot: true,
        colors: ["brown", "black"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Nike Air Max 270 React Pro",
        price: "11999",
        discountPrice: "8299",
        discountPercent: 31,
        ratingValue: "5.0",
        ratingCount: 156,
        isHot: false,
        colors: ["blue", "green", "white"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Nike Air Max 270 React Colorful",
        price: "12999",
        discountPrice: "9299",
        discountPercent: 29,
        ratingValue: "4.0",
        ratingCount: 89,
        isHot: false,
        colors: ["yellow", "green", "blue"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Nike Air Max 270 React Purple",
        price: "9499",
        discountPrice: "6899",
        discountPercent: 27,
        ratingValue: "5.0",
        ratingCount: 203,
        isHot: false,
        colors: ["purple", "blue"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Adidas Ultraboost 22",
        price: "15999",
        discountPrice: "11999",
        discountPercent: 25,
        ratingValue: "4.5",
        ratingCount: 145,
        isHot: true,
        colors: ["black", "white", "blue"],
        category: "sneakers",
        brand: "Adidas",
        imageUrl: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Adidas Stan Smith Classic",
        price: "8999",
        discountPrice: "6999",
        discountPercent: 22,
        ratingValue: "4.2",
        ratingCount: 267,
        isHot: false,
        colors: ["white", "green"],
        category: "sneakers",
        brand: "Adidas",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Adidas NMD R1",
        price: "12999",
        discountPrice: "9999",
        discountPercent: 23,
        ratingValue: "4.3",
        ratingCount: 198,
        isHot: true,
        colors: ["black", "red", "white"],
        category: "sneakers",
        brand: "Adidas",
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Vans Old Skool",
        price: "5999",
        discountPrice: "4499",
        discountPercent: 25,
        ratingValue: "4.1",
        ratingCount: 156,
        isHot: false,
        colors: ["black", "white"],
        category: "sneakers",
        brand: "Vans",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Vans Authentic",
        price: "4999",
        discountPrice: "3999",
        discountPercent: 20,
        ratingValue: "4.0",
        ratingCount: 89,
        isHot: false,
        colors: ["blue", "red", "yellow"],
        category: "sneakers",
        brand: "Vans",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Converse Chuck Taylor All Star",
        price: "6999",
        discountPrice: "5499",
        discountPercent: 21,
        ratingValue: "4.4",
        ratingCount: 234,
        isHot: false,
        colors: ["black", "white", "red"],
        category: "sneakers",
        brand: "All Stars",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Puma RS-X",
        price: "10999",
        discountPrice: "7999",
        discountPercent: 27,
        ratingValue: "4.2",
        ratingCount: 167,
        isHot: true,
        colors: ["white", "blue", "yellow"],
        category: "sneakers",
        brand: "Actions",
        imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Skechers D'Lites",
        price: "7999",
        discountPrice: "5999",
        discountPercent: 25,
        ratingValue: "4.0",
        ratingCount: 123,
        isHot: false,
        colors: ["white", "black", "pink"],
        category: "sneakers",
        brand: "Skechers",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Skechers Go Walk",
        price: "6999",
        discountPrice: "4999",
        discountPercent: 29,
        ratingValue: "4.3",
        ratingCount: 189,
        isHot: false,
        colors: ["gray", "blue"],
        category: "sneakers",
        brand: "Skechers",
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Nike Air Force 1",
        price: "8999",
        discountPrice: "6999",
        discountPercent: 22,
        ratingValue: "4.5",
        ratingCount: 312,
        isHot: true,
        colors: ["white", "black"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Nike React Element 55",
        price: "10999",
        discountPrice: "8499",
        discountPercent: 23,
        ratingValue: "4.1",
        ratingCount: 145,
        isHot: false,
        colors: ["black", "white", "orange"],
        category: "sneakers",
        brand: "Nike",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Adidas Gazelle",
        price: "7999",
        discountPrice: "5999",
        discountPercent: 25,
        ratingValue: "4.2",
        ratingCount: 178,
        isHot: false,
        colors: ["blue", "red", "green"],
        category: "sneakers",
        brand: "Adidas",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Adidas Superstar",
        price: "8999",
        discountPrice: "6799",
        discountPercent: 24,
        ratingValue: "4.4",
        ratingCount: 267,
        isHot: true,
        colors: ["white", "black", "gold"],
        category: "sneakers",
        brand: "Adidas",
        imageUrl: "https://images.unsplash.com/photo-1460353581641-37baddab0fa2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "New Balance 990v5",
        price: "16999",
        discountPrice: "12999",
        discountPercent: 24,
        ratingValue: "4.6",
        ratingCount: 89,
        isHot: true,
        colors: ["gray", "navy"],
        category: "sneakers",
        brand: "Actions",
        imageUrl: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Reebok Classic Leather",
        price: "6999",
        discountPrice: "4999",
        discountPercent: 29,
        ratingValue: "4.0",
        ratingCount: 134,
        isHot: false,
        colors: ["white", "black", "brown"],
        category: "sneakers",
        brand: "Actions",
        imageUrl: "https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Puma Suede Classic",
        price: "7999",
        discountPrice: "5799",
        discountPercent: 28,
        ratingValue: "4.2",
        ratingCount: 167,
        isHot: false,
        colors: ["blue", "red", "black"],
        category: "sneakers",
        brand: "Actions",
        imageUrl: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Converse One Star",
        price: "5999",
        discountPrice: "4299",
        discountPercent: 28,
        ratingValue: "4.1",
        ratingCount: 98,
        isHot: false,
        colors: ["black", "white", "yellow"],
        category: "sneakers",
        brand: "All Stars",
        imageUrl: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      },
      {
        name: "Vans Sk8-Hi",
        price: "6999",
        discountPrice: "5499",
        discountPercent: 21,
        ratingValue: "4.3",
        ratingCount: 156,
        isHot: false,
        colors: ["black", "white", "red"],
        category: "sneakers",
        brand: "Vans",
        imageUrl: "https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?ixlib=rb-4.0.3&auto=format&fit=crop&w=400&h=300"
      }
    ];

    sampleProducts.forEach(product => {
      const id = randomUUID();
      const fullProduct: Product = { 
        ...product, 
        id,
        colors: Array.isArray(product.colors) ? product.colors : []
      };
      this.products.set(id, fullProduct);
    });
  }

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = randomUUID();
    const user: User = { ...insertUser, id };
    this.users.set(id, user);
    return user;
  }

  async getProducts(filters?: {
    category?: string;
    brand?: string[];
    colors?: string[];
    minPrice?: number;
    maxPrice?: number;
    sortBy?: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'popularity-desc';
    page?: number;
    limit?: number;
  }): Promise<{ products: Product[]; total: number }> {
    let products = Array.from(this.products.values());

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

    return { products, total };
  }

  async getProductById(id: string): Promise<Product | undefined> {
    return this.products.get(id);
  }

  async createProduct(product: InsertProduct): Promise<Product> {
    const id = randomUUID();
    const fullProduct: Product = { 
      ...product, 
      id,
      colors: product.colors || []
    };
    this.products.set(id, fullProduct);
    return fullProduct;
  }
}

export const storage = new MemStorage();

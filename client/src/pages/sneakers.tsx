import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Footer from "@/components/footer";
import ProductGrid from "@/components/product-grid";
import Sidebar from "@/components/sidebar";
import { type FilterState, type PaginationState } from "@/lib/types";
import type { Product } from "@shared/schema";

export default function Sneakers() {
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    colors: [],
    priceRange: [1299, 25999],
  });
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 12;

  // Get products filtered to sneakers/shoes only
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['sneakers', {
      brands: filters.brands,
      colors: filters.colors,
      minPrice: filters.priceRange[0],
      maxPrice: filters.priceRange[1],
      sortBy,
      page: currentPage,
      limit: itemsPerPage,
    }],
    queryFn: async () => {
      const params = new URLSearchParams();
      
      // Filter to sneakers/shoes category
      params.set('category', 'sneakers');
      
      if (filters.brands.length > 0) {
        params.set('brand', filters.brands.join(','));
      }
      
      if (filters.colors.length > 0) {
        params.set('colors', filters.colors.join(','));
      }
      
      params.set('minPrice', filters.priceRange[0].toString());
      params.set('maxPrice', filters.priceRange[1].toString());
      params.set('sortBy', sortBy);
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());
      
      const url = `/api/products?${params.toString()}`;
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch sneakers: ${response.statusText}`);
      }
      
      return response.json();
    },
  });

  const products = (productsData as { products?: Product[]; total?: number })?.products || [];
  const totalItems = (productsData as { products?: Product[]; total?: number })?.total || 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const pagination: PaginationState = {
    currentPage,
    totalPages,
    totalItems,
    itemsPerPage,
  };

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1);
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground">
          Loading sneakers...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Sneakers Collection</h1>
          <p className="text-muted-foreground">
            Discover the latest styles and hottest drops from top brands
          </p>
        </div>
        
        <div className="flex gap-8">
          <div className="w-64 flex-shrink-0">
            <Sidebar filters={filters} onFiltersChange={handleFiltersChange} />
          </div>
          
          <div className="flex-1">
            <ProductGrid
              products={products}
              pagination={pagination}
              sortBy={sortBy}
              onSortChange={handleSortChange}
              onPageChange={handlePageChange}
              viewMode={viewMode}
              onViewModeChange={setViewMode}
            />
          </div>
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
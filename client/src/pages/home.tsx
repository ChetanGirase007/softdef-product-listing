import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import Header from "@/components/header";
import Sidebar from "@/components/sidebar";
import HeroBanner from "@/components/hero-banner";
import ProductGrid from "@/components/product-grid";
import Footer from "@/components/footer";
import { type FilterState, type PaginationState } from "@/lib/types";
import type { Product } from "@shared/schema";

export default function Home() {
  const [, setLocation] = useLocation();
  const [filters, setFilters] = useState<FilterState>({
    brands: [],
    colors: [],
    priceRange: [1299, 25999],
  });
  const [sortBy, setSortBy] = useState('name-asc');
  const [currentPage, setCurrentPage] = useState(1);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const itemsPerPage = 12;

  // Get products with current filters
  const { data: productsData, isLoading } = useQuery({
    queryKey: ['products', {
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
        throw new Error(`Failed to fetch products: ${response.statusText}`);
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

  // Update URL parameters when filters change
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams();
      
      if (filters.brands.length > 0) {
        params.set('brand', filters.brands.join(','));
      }
      
      if (filters.colors.length > 0) {
        params.set('colors', filters.colors.join(','));
      }
      
      if (filters.priceRange[0] !== 1299 || filters.priceRange[1] !== 25999) {
        params.set('minPrice', filters.priceRange[0].toString());
        params.set('maxPrice', filters.priceRange[1].toString());
      }
      
      if (sortBy !== 'name-asc') {
        params.set('sortBy', sortBy);
      }
      
      if (currentPage !== 1) {
        params.set('page', currentPage.toString());
      }
      
      const newUrl = params.toString() ? `/?${params.toString()}` : '/';
      window.history.replaceState({}, '', newUrl);
    }
  }, [filters, sortBy, currentPage]);

  // Parse URL parameters on mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const params = new URLSearchParams(window.location.search);
      
      const brands = params.get('brand')?.split(',').filter(Boolean) || [];
      const colors = params.get('colors')?.split(',').filter(Boolean) || [];
      const minPrice = params.get('minPrice') ? parseInt(params.get('minPrice')!) : 1299;
      const maxPrice = params.get('maxPrice') ? parseInt(params.get('maxPrice')!) : 25999;
      const urlSortBy = params.get('sortBy') || 'name-asc';
      const urlPage = params.get('page') ? parseInt(params.get('page')!) : 1;
      
      setFilters({
        brands,
        colors,
        priceRange: [minPrice, maxPrice],
      });
      setSortBy(urlSortBy);
      setCurrentPage(urlPage);
    }
  }, []);

  const handleFiltersChange = (newFilters: FilterState) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleSortChange = (newSort: string) => {
    setSortBy(newSort);
    setCurrentPage(1); // Reset to first page when sort changes
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg text-muted-foreground" data-testid="loading-message">
          Loading products...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="flex">
        <Sidebar filters={filters} onFiltersChange={handleFiltersChange} />
        
        <main className="flex-1">
          <HeroBanner />
          <ProductGrid
            products={products}
            pagination={pagination}
            sortBy={sortBy}
            onSortChange={handleSortChange}
            onPageChange={handlePageChange}
            viewMode={viewMode}
            onViewModeChange={setViewMode}
          />
        </main>
      </div>
      
      <Footer />
    </div>
  );
}

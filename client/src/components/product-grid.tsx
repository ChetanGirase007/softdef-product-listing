import { useState } from "react";
import { Grid, List, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import ProductCard from "./product-card";
import { sortOptions, type FilterState, type PaginationState } from "@/lib/types";
import type { Product } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

interface ProductGridProps {
  products: Product[];
  pagination: PaginationState;
  sortBy: string;
  onSortChange: (sort: string) => void;
  onPageChange: (page: number) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

export default function ProductGrid({
  products,
  pagination,
  sortBy,
  onSortChange,
  onPageChange,
  viewMode,
  onViewModeChange
}: ProductGridProps) {
  const { toast } = useToast();

  const handleAddToCart = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    toast({
      title: "Added to Cart",
      description: `${product?.name} has been added to your cart.`,
    });
  };

  const handleAddToWishlist = async (productId: string) => {
    const product = products.find(p => p.id === productId);
    toast({
      title: "Added to Wishlist",
      description: `${product?.name} has been added to your wishlist.`,
    });
  };

  const handleQuickView = async (productId: string) => {
    toast({
      title: "Quick View",
      description: "Quick view functionality coming soon!",
    });
  };

  const generatePageNumbers = () => {
    const { currentPage, totalPages } = pagination;
    const pages: (number | string)[] = [];
    
    // Always show first page
    pages.push(1);
    
    if (currentPage > 3) {
      pages.push('...');
    }
    
    // Show current page and surrounding pages
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) {
        pages.push(i);
      }
    }
    
    if (currentPage < totalPages - 2) {
      pages.push('...');
    }
    
    // Always show last page if there are more than 1 page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }
    
    return pages;
  };

  return (
    <div className="flex-1">
      {/* Sorting and View Controls */}
      <section className="bg-white border-b border-border">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <span className="text-sm text-muted-foreground">Sort by:</span>
              <Select value={sortBy} onValueChange={onSortChange}>
                <SelectTrigger className="w-48" data-testid="sort-select">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {sortOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button
                variant={viewMode === 'grid' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('grid')}
                data-testid="view-grid-button"
              >
                <Grid className="w-4 h-4" />
              </Button>
              <Button
                variant={viewMode === 'list' ? 'default' : 'ghost'}
                size="sm"
                onClick={() => onViewModeChange('list')}
                data-testid="view-list-button"
              >
                <List className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Product Grid */}
      <section className="container mx-auto px-4 py-8">
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={handleAddToCart}
              onAddToWishlist={handleAddToWishlist}
              onQuickView={handleQuickView}
            />
          ))}
        </div>

        {products.length === 0 && (
          <div className="text-center py-12">
            <p className="text-lg text-muted-foreground" data-testid="no-products-message">
              No products found matching your filters.
            </p>
          </div>
        )}

        {/* Pagination */}
        {pagination.totalPages > 1 && (
          <div className="mt-12 flex items-center justify-center space-x-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              data-testid="pagination-previous"
            >
              <ChevronLeft className="w-4 h-4 mr-1" />
              Previous
            </Button>
            
            {generatePageNumbers().map((page, index) => (
              <div key={index}>
                {page === '...' ? (
                  <span className="px-2 text-muted-foreground">...</span>
                ) : (
                  <Button
                    variant={pagination.currentPage === page ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => onPageChange(page as number)}
                    data-testid={`pagination-page-${page}`}
                  >
                    {page}
                  </Button>
                )}
              </div>
            ))}
            
            <Button
              variant="ghost"
              size="sm"
              onClick={() => onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              data-testid="pagination-next"
            >
              Next
              <ChevronRight className="w-4 h-4 ml-1" />
            </Button>
          </div>
        )}
      </section>
    </div>
  );
}

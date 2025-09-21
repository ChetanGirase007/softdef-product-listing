import { useState } from "react";
import { Heart, Eye, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { availableColors } from "@/lib/types";
import type { Product } from "@shared/schema";

interface ProductCardProps {
  product: Product;
  onAddToCart: (productId: string) => void;
  onAddToWishlist: (productId: string) => void;
  onQuickView: (productId: string) => void;
}

export default function ProductCard({ 
  product, 
  onAddToCart, 
  onAddToWishlist, 
  onQuickView 
}: ProductCardProps) {
  const [selectedColor, setSelectedColor] = useState<string>(product.colors[0] || '');
  const [isAddingToCart, setIsAddingToCart] = useState(false);

  const handleAddToCart = async () => {
    setIsAddingToCart(true);
    await onAddToCart(product.id);
    
    // Show feedback
    setTimeout(() => {
      setIsAddingToCart(false);
    }, 1500);
  };

  const formatPrice = (price: string) => {
    return `₹${parseFloat(price).toLocaleString()}`;
  };

  const renderStars = (rating: string) => {
    const ratingNum = parseFloat(rating);
    const fullStars = Math.floor(ratingNum);
    const hasHalfStar = ratingNum % 1 !== 0;

    return (
      <div className="flex items-center space-x-1">
        <div className="flex text-yellow-400">
          {[...Array(fullStars)].map((_, i) => (
            <Star key={i} className="w-3 h-3 fill-current" />
          ))}
          {hasHalfStar && <Star className="w-3 h-3 fill-current opacity-50" />}
          {[...Array(5 - Math.ceil(ratingNum))].map((_, i) => (
            <Star key={i} className="w-3 h-3 text-gray-300" />
          ))}
        </div>
        <span className="text-xs text-muted-foreground">({product.ratingCount})</span>
      </div>
    );
  };

  const getColorClass = (colorValue: string) => {
    const color = availableColors.find(c => c.value === colorValue);
    return color?.color || 'bg-gray-400';
  };

  return (
    <div className="product-card bg-card rounded-lg shadow-md overflow-hidden transition-all duration-200 hover:shadow-lg hover:-translate-y-1">
      <div className="relative group">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
          data-testid={`product-image-${product.id}`}
          loading="lazy"
        />
        
        {product.isHot && (
          <Badge 
            variant="destructive" 
            className="absolute top-2 left-2"
            data-testid={`hot-badge-${product.id}`}
          >
            HOT
          </Badge>
        )}
        
        <div className="absolute top-2 right-2 space-y-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
            onClick={() => onAddToWishlist(product.id)}
            data-testid={`wishlist-${product.id}`}
            aria-label="Add to wishlist"
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            size="sm"
            variant="secondary"
            className="bg-white/80 hover:bg-white p-1.5 rounded-full shadow-sm"
            onClick={() => onQuickView(product.id)}
            data-testid={`quick-view-${product.id}`}
            aria-label="Quick view"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <h3 
          className="font-semibold text-card-foreground mb-2 line-clamp-2"
          data-testid={`product-name-${product.id}`}
        >
          {product.name}
        </h3>
        
        <div className="mb-2" data-testid={`product-rating-${product.id}`}>
          {renderStars(product.ratingValue)}
        </div>
        
        <div className="flex items-center space-x-2 mb-3">
          <span 
            className="text-lg font-bold text-card-foreground"
            data-testid={`product-discount-price-${product.id}`}
          >
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <>
              <span 
                className="text-sm text-muted-foreground line-through"
                data-testid={`product-original-price-${product.id}`}
              >
                {formatPrice(product.price)}
              </span>
              <Badge 
                variant="outline" 
                className="text-xs bg-green-100 text-green-800 border-green-200"
                data-testid={`product-discount-${product.id}`}
              >
                {product.discountPercent}% off
              </Badge>
            </>
          )}
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex space-x-1" data-testid={`product-colors-${product.id}`}>
            {product.colors.slice(0, 3).map((color) => (
              <button
                key={color}
                onClick={() => setSelectedColor(color)}
                className={`w-4 h-4 rounded-full border transition-all ${getColorClass(color)} ${
                  selectedColor === color
                    ? "ring-2 ring-primary ring-offset-1"
                    : "border-gray-300"
                }`}
                title={color}
                data-testid={`product-color-${product.id}-${color}`}
              />
            ))}
            {product.colors.length > 3 && (
              <span className="text-xs text-muted-foreground self-center">
                +{product.colors.length - 3}
              </span>
            )}
          </div>
          
          <Button
            size="sm"
            className={`px-3 py-1.5 text-sm font-medium transition-colors ${
              isAddingToCart
                ? "bg-green-600 hover:bg-green-600"
                : "bg-primary hover:bg-primary/90"
            }`}
            onClick={handleAddToCart}
            disabled={isAddingToCart}
            data-testid={`add-to-cart-${product.id}`}
          >
            {isAddingToCart ? "Added!" : "Add to Cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}

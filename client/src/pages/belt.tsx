import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface Belt {
  id: string;
  name: string;
  price: number;
  material: string;
  color: string;
  sizes: string[];
  image: string;
  brand: string;
  description: string;
}

export default function Belt() {
  const [sortBy, setSortBy] = useState('name-asc');
  const [selectedSize, setSelectedSize] = useState<Record<string, string>>({});

  const belts: Belt[] = [
    {
      id: "1",
      name: "Classic Leather Belt",
      price: 2999,
      material: "Genuine Leather",
      color: "Black",
      sizes: ["28", "30", "32", "34", "36", "38", "40"],
      image: "/attached_assets/stock_images/luxury_leather_belts_68266f56.jpg",
      brand: "SoftDef",
      description: "Premium quality genuine leather belt perfect for formal occasions"
    },
    {
      id: "2", 
      name: "Reversible Brown Belt",
      price: 3499,
      material: "Full Grain Leather",
      color: "Brown/Black",
      sizes: ["30", "32", "34", "36", "38", "40"],
      image: "/attached_assets/stock_images/luxury_leather_belts_c9139c62.jpg",
      brand: "SoftDef",
      description: "Versatile reversible belt that goes with any outfit"
    },
    {
      id: "3",
      name: "Casual Canvas Belt", 
      price: 1999,
      material: "Canvas",
      color: "Navy",
      sizes: ["S", "M", "L", "XL"],
      image: "/attached_assets/stock_images/luxury_leather_belts_25ecfdb4.jpg",
      brand: "UrbanStyle",
      description: "Durable canvas belt perfect for casual wear"
    },
    {
      id: "4",
      name: "Executive Dress Belt",
      price: 4499,
      material: "Italian Leather", 
      color: "Cognac",
      sizes: ["30", "32", "34", "36", "38", "40", "42"],
      image: "/attached_assets/stock_images/luxury_leather_belts_b03bdd97.jpg",
      brand: "Luxury",
      description: "Handcrafted Italian leather belt for the discerning professional"
    },
    {
      id: "5",
      name: "Tactical Web Belt",
      price: 1799,
      material: "Nylon Webbing",
      color: "Olive Green",
      sizes: ["S", "M", "L", "XL", "XXL"],
      image: "/attached_assets/stock_images/luxury_leather_belts_02b6095d.jpg", 
      brand: "Tactical",
      description: "Heavy-duty tactical belt built for durability and function"
    },
    {
      id: "6",
      name: "Braided Leather Belt",
      price: 3299,
      material: "Braided Leather",
      color: "Tan", 
      sizes: ["28", "30", "32", "34", "36", "38"],
      image: "/attached_assets/stock_images/luxury_leather_belts_25b69e9a.jpg",
      brand: "Artisan",
      description: "Handwoven braided leather belt with unique texture and style"
    }
  ];

  const sortedBelts = [...belts].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'name-asc':
        return a.name.localeCompare(b.name);
      case 'name-desc':
        return b.name.localeCompare(a.name);
      default:
        return 0;
    }
  });

  const handleSizeSelect = (beltId: string, size: string) => {
    setSelectedSize(prev => ({ ...prev, [beltId]: size }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold mb-2">Belt Collection</h1>
          <p className="text-muted-foreground">
            Complete your look with our premium selection of belts
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <p className="text-muted-foreground">
            {belts.length} belts available
          </p>
          
          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name-asc">Name A-Z</SelectItem>
              <SelectItem value="name-desc">Name Z-A</SelectItem>
              <SelectItem value="price-low">Price: Low to High</SelectItem>
              <SelectItem value="price-high">Price: High to Low</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sortedBelts.map((belt) => (
            <Card key={belt.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-100">
                <img 
                  src={belt.image} 
                  alt={belt.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <CardContent className="p-6">
                <div className="mb-2">
                  <Badge variant="secondary" className="text-xs">
                    {belt.brand}
                  </Badge>
                </div>
                
                <h3 className="font-semibold text-lg mb-2">{belt.name}</h3>
                <p className="text-sm text-muted-foreground mb-3">
                  {belt.description}
                </p>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span>Material:</span>
                    <span className="font-medium">{belt.material}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Color:</span>
                    <span className="font-medium">{belt.color}</span>
                  </div>
                </div>

                <div className="mb-4">
                  <label className="text-sm font-medium mb-2 block">Size:</label>
                  <Select 
                    value={selectedSize[belt.id] || ""}
                    onValueChange={(size) => handleSizeSelect(belt.id, size)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select size" />
                    </SelectTrigger>
                    <SelectContent>
                      {belt.sizes.map((size) => (
                        <SelectItem key={size} value={size}>
                          {size}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-2xl font-bold">
                    ₹{(belt.price / 100).toLocaleString()}
                  </span>
                  <Button 
                    disabled={!selectedSize[belt.id]}
                    className="ml-4"
                  >
                    Add to Bag
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <Footer />
    </div>
  );
}
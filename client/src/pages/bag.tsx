import { useState } from "react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Trash2, Plus, Minus } from "lucide-react";

interface BagItem {
  id: string;
  name: string;
  price: number;
  size: string;
  color: string;
  quantity: number;
  image: string;
}

export default function Bag() {
  const [bagItems, setBagItems] = useState<BagItem[]>([
    {
      id: "1",
      name: "Nike Air Force 1",
      price: 9999,
      size: "42",
      color: "White",
      quantity: 1,
      image: "/attached_assets/stock_images/high_quality_sneaker_a4e8b655.jpg"
    },
    {
      id: "2", 
      name: "Adidas Gazelle",
      price: 7999,
      size: "41",
      color: "Navy",
      quantity: 2,
      image: "/attached_assets/stock_images/high_quality_sneaker_96769d4d.jpg"
    }
  ]);

  const updateQuantity = (id: string, change: number) => {
    setBagItems(items => 
      items.map(item => 
        item.id === id 
          ? { ...item, quantity: Math.max(0, item.quantity + change) }
          : item
      ).filter(item => item.quantity > 0)
    );
  };

  const removeItem = (id: string) => {
    setBagItems(items => items.filter(item => item.id !== id));
  };

  const subtotal = bagItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 15000 ? 0 : 999;
  const total = subtotal + shipping;

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Bag</h1>
        
        {bagItems.length === 0 ? (
          <div className="text-center py-16">
            <h2 className="text-xl font-semibold mb-4">Your bag is empty</h2>
            <p className="text-muted-foreground mb-8">Add some items to get started</p>
            <Button onClick={() => window.history.back()}>Continue Shopping</Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {bagItems.map((item) => (
                <Card key={item.id}>
                  <CardContent className="p-6">
                    <div className="flex gap-4">
                      <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0">
                        <img 
                          src={item.image} 
                          alt={item.name}
                          className="w-full h-full object-cover rounded-lg"
                        />
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg">{item.name}</h3>
                        <p className="text-muted-foreground">Size: {item.size} | Color: {item.color}</p>
                        <p className="font-bold text-lg mt-2">₹{(item.price / 100).toLocaleString()}</p>
                      </div>
                      
                      <div className="flex flex-col items-end gap-2">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeItem(item.id)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                        
                        <div className="flex items-center gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, -1)}
                          >
                            <Minus className="h-3 w-3" />
                          </Button>
                          <span className="w-8 text-center">{item.quantity}</span>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => updateQuantity(item.id, 1)}
                          >
                            <Plus className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            
            <div className="lg:col-span-1">
              <Card className="sticky top-24">
                <CardContent className="p-6">
                  <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                  
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>₹{(subtotal / 100).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Shipping</span>
                      <span>{shipping === 0 ? 'Free' : `₹${(shipping / 100).toLocaleString()}`}</span>
                    </div>
                    <Separator />
                    <div className="flex justify-between font-bold text-lg">
                      <span>Total</span>
                      <span>₹{(total / 100).toLocaleString()}</span>
                    </div>
                  </div>
                  
                  {shipping > 0 && (
                    <p className="text-sm text-muted-foreground mt-4">
                      Add ₹{((15000 - subtotal) / 100).toLocaleString()} more for free shipping
                    </p>
                  )}
                  
                  <Button className="w-full mt-6" size="lg">
                    Proceed to Checkout
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        )}
      </div>
      
      <Footer />
    </div>
  );
}
import { useState } from "react";
import { Link, useLocation } from "wouter";
import { ShoppingCart, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

export default function Header() {
  const [location] = useLocation();
  const [cartItemCount] = useState(3); // Mock cart count
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const navItems = [
    { href: "/", label: "HOME" },
    { href: "/bag", label: "BAG" },
    { href: "/sneakers", label: "SNEAKERS" },
    { href: "/belt", label: "BELT" },
    { href: "/contact", label: "CONTACT" },
  ];

  return (
    <header className="bg-white border-b border-border shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link href="/" className="flex-shrink-0">
              <span className="text-2xl font-bold text-primary" data-testid="logo">
                SoftDef
              </span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {navItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-medium transition-colors ${
                    location === item.href
                      ? "text-primary"
                      : "text-muted-foreground hover:text-foreground"
                  }`}
                  data-testid={`nav-${item.label.toLowerCase()}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          </nav>

          {/* Cart and Mobile Menu */}
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="sm"
              className="relative p-2"
              data-testid="cart-button"
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-destructive text-destructive-foreground text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  {cartItemCount}
                </span>
              )}
            </Button>

            {/* Mobile Menu Toggle */}
            <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="md:hidden p-2"
                  data-testid="mobile-menu-button"
                >
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <div className="flex flex-col space-y-4 mt-6">
                  {navItems.map((item) => (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`font-medium text-lg transition-colors ${
                        location === item.href
                          ? "text-primary"
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid={`mobile-nav-${item.label.toLowerCase()}`}
                    >
                      {item.label}
                    </Link>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  );
}

import { Button } from "@/components/ui/button";

export default function HeroBanner() {
  return (
    <section className="hero-gradient text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <h1 className="text-4xl font-bold mb-4" data-testid="hero-title">
              Nike Men Running Sneakers
            </h1>
            <p className="text-lg opacity-90 mb-6" data-testid="hero-description">
              Experience the latest in athletic footwear technology
            </p>
            <Button
              size="lg"
              className="bg-white text-primary hover:bg-gray-100 px-8 py-3 font-semibold"
              data-testid="hero-shop-button"
            >
              Shop Now
            </Button>
          </div>
          <div className="flex-1 flex justify-end">
            <img
              src="https://images.unsplash.com/photo-1542291026-7eec264c27ff?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=800&h=600"
              alt="Nike Men Running Sneakers"
              className="max-w-md h-auto rounded-lg"
              data-testid="hero-image"
            />
          </div>
        </div>
      </div>
    </section>
  );
}

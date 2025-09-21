import { Button } from "@/components/ui/button";
import { Link } from "wouter";

export default function HeroBanner() {
  return (
    <section 
      className="relative text-white min-h-[500px] flex items-center" 
      style={{
        backgroundImage: 'url(/attached_assets/stock_images/modern_e-commerce_fa_374d32ab.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat'
      }}
    >
      <div className="absolute inset-0 bg-black bg-opacity-50"></div>
      <div className="container mx-auto px-4 py-16 relative z-10">
        <div className="max-w-2xl">
          <h1 className="text-5xl md:text-6xl font-bold mb-6" data-testid="hero-title">
            Step Into Style
          </h1>
          <p className="text-xl md:text-2xl opacity-90 mb-8 leading-relaxed" data-testid="hero-description">
            Discover our premium collection of sneakers, belts, and accessories. Quality meets fashion in every piece.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Link href="/sneakers">
              <Button
                size="lg"
                className="bg-white text-black hover:bg-gray-100 px-8 py-4 font-semibold text-lg"
                data-testid="hero-shop-button"
              >
                Shop Collection
              </Button>
            </Link>
            <Link href="/">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white hover:text-black px-8 py-4 font-semibold text-lg"
                data-testid="hero-new-arrivals-button"
              >
                New Arrivals
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

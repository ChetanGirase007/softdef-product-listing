import { Facebook, Twitter, Instagram } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div>
            <h3 className="font-bold text-lg mb-4" data-testid="footer-company-title">
              E-Comm
            </h3>
            <p className="text-sm opacity-90 mb-4" data-testid="footer-company-description">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore.
            </p>
            <div className="flex space-x-3">
              <a 
                href="#" 
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="Facebook"
                data-testid="footer-facebook-link"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="Twitter"
                data-testid="footer-twitter-link"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href="#" 
                className="text-primary-foreground/70 hover:text-primary-foreground transition-colors"
                aria-label="Instagram"
                data-testid="footer-instagram-link"
              >
                <Instagram className="w-5 h-5" />
              </a>
            </div>
          </div>
          
          {/* Follow Us */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-follow-title">
              Follow Us
            </h4>
            <p className="text-sm opacity-90" data-testid="footer-follow-description">
              Since we have been providing quality products to our customers for over 10 years.
            </p>
          </div>
          
          {/* Contact Us */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-contact-title">
              Contact Us
            </h4>
            <div className="text-sm space-y-2">
              <p className="opacity-90" data-testid="footer-address-1">E-Commerce, Ste 350</p>
              <p className="opacity-90" data-testid="footer-address-2">4725 N Broad St</p>
              <p className="opacity-90" data-testid="footer-address-3">Chicago 60614</p>
            </div>
          </div>
          
          {/* Information Links */}
          <div>
            <h4 className="font-semibold mb-4" data-testid="footer-info-title">
              Information
            </h4>
            <ul className="text-sm space-y-2">
              <li>
                <a 
                  href="#" 
                  className="opacity-90 hover:opacity-100 transition-opacity"
                  data-testid="footer-about-link"
                >
                  About Us
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="opacity-90 hover:opacity-100 transition-opacity"
                  data-testid="footer-information-link"
                >
                  Information
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="opacity-90 hover:opacity-100 transition-opacity"
                  data-testid="footer-privacy-link"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a 
                  href="#" 
                  className="opacity-90 hover:opacity-100 transition-opacity"
                  data-testid="footer-terms-link"
                >
                  Terms & Conditions
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        {/* Bottom Bar */}
        <div className="border-t border-primary-foreground/20 mt-8 pt-8">
          <div className="flex flex-col md:flex-row items-center justify-between">
            <div className="flex items-center space-x-4 mb-4 md:mb-0">
              <a href="#" className="text-sm opacity-90 hover:opacity-100" data-testid="footer-service-link">
                Service
              </a>
              <a href="#" className="text-sm opacity-90 hover:opacity-100" data-testid="footer-account-link">
                My Account
              </a>
              <a href="#" className="text-sm opacity-90 hover:opacity-100" data-testid="footer-offers-link">
                Our Offers
              </a>
            </div>
            <div className="flex items-center space-x-2">
              <div className="bg-white/10 px-2 py-1 rounded text-xs" data-testid="payment-visa">
                VISA
              </div>
              <div className="bg-white/10 px-2 py-1 rounded text-xs" data-testid="payment-mc">
                MC
              </div>
              <div className="bg-white/10 px-2 py-1 rounded text-xs" data-testid="payment-amex">
                AMEX
              </div>
              <div className="bg-white/10 px-2 py-1 rounded text-xs" data-testid="payment-pp">
                PP
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

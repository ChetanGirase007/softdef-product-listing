import { useState } from "react";
import { ChevronDown, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { availableColors, type FilterState } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";

interface SidebarProps {
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
}

export default function Sidebar({ filters, onFiltersChange }: SidebarProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    nike: false,
    adidas: false,
    vans: false,
    allstars: false,
    actions: false,
    skechers: false,
  });

  const { data: filterData } = useQuery({
    queryKey: ['filters'],
    queryFn: async () => {
      const response = await fetch('/api/filters');
      if (!response.ok) {
        throw new Error(`Failed to fetch filters: ${response.statusText}`);
      }
      return response.json();
    },
  });

  const brands = (filterData as { brands?: Record<string, number> })?.brands || {};

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const handleBrandToggle = (brand: string) => {
    const newBrands = filters.brands.includes(brand)
      ? filters.brands.filter(b => b !== brand)
      : [...filters.brands, brand];
    
    onFiltersChange({
      ...filters,
      brands: newBrands,
    });
  };

  const handleColorToggle = (color: string) => {
    const newColors = filters.colors.includes(color)
      ? filters.colors.filter(c => c !== color)
      : [...filters.colors, color];
    
    onFiltersChange({
      ...filters,
      colors: newColors,
    });
  };

  const handlePriceRangeChange = (value: number[]) => {
    onFiltersChange({
      ...filters,
      priceRange: [value[0], value[1]],
    });
  };

  const brandSections = [
    { key: 'nike', name: 'Nike', brand: 'Nike' },
    { key: 'adidas', name: 'Adidas', brand: 'Adidas' },
    { key: 'vans', name: 'Vans', brand: 'Vans' },
    { key: 'allstars', name: 'All Stars', brand: 'All Stars' },
    { key: 'actions', name: 'Actions', brand: 'Actions' },
    { key: 'skechers', name: 'Skechers', brand: 'Skechers' },
  ];

  return (
    <aside className="w-80 bg-gray-900 text-white sticky top-16 h-screen overflow-y-auto hidden lg:block">
      <div className="p-6">
        <h2 className="text-lg font-semibold mb-6" data-testid="sidebar-title">
          Product List-Grid
        </h2>

        {/* Brand Filters */}
        <div className="space-y-4">
          {brandSections.map((section) => (
            <Collapsible
              key={section.key}
              open={expandedSections[section.key]}
              onOpenChange={() => toggleSection(section.key)}
            >
              <CollapsibleTrigger asChild>
                <Button
                  variant="ghost"
                  className="flex items-center justify-between w-full text-left py-2 text-white hover:text-white hover:bg-gray-800"
                  data-testid={`filter-${section.key}-toggle`}
                >
                  <span className="font-medium">{section.name}</span>
                  <div className="flex items-center space-x-2">
                    <span className="text-gray-400 text-sm">
                      {brands[section.brand] || 0}
                    </span>
                    {expandedSections[section.key] ? (
                      <ChevronDown className="h-4 w-4" />
                    ) : (
                      <ChevronRight className="h-4 w-4" />
                    )}
                  </div>
                </Button>
              </CollapsibleTrigger>
              <CollapsibleContent className="ml-4 mt-2 space-y-2">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id={`brand-${section.key}`}
                    checked={filters.brands.includes(section.brand)}
                    onChange={() => handleBrandToggle(section.brand)}
                    className="rounded border-gray-600 text-primary focus:ring-primary"
                    data-testid={`filter-${section.key}-checkbox`}
                  />
                  <label htmlFor={`brand-${section.key}`} className="text-sm text-gray-300">
                    {section.name}
                  </label>
                </div>
              </CollapsibleContent>
            </Collapsible>
          ))}
        </div>

        {/* Price Range Filter */}
        <div className="mt-8">
          <h3 className="font-medium text-white mb-4" data-testid="price-filter-title">
            PRICES
          </h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-300">Range:</span>
              <div className="flex items-center space-x-2">
                <span data-testid="price-min">₹{filters.priceRange[0].toLocaleString()}</span>
                <span className="text-gray-500">-</span>
                <span data-testid="price-max">₹{filters.priceRange[1].toLocaleString()}</span>
              </div>
            </div>
            <div className="px-2">
              <Slider
                value={filters.priceRange}
                onValueChange={handlePriceRangeChange}
                min={1299}
                max={25999}
                step={100}
                className="w-full"
                data-testid="price-range-slider"
              />
            </div>
          </div>
        </div>

        {/* Color Filter */}
        <div className="mt-8">
          <h3 className="font-medium text-white mb-4" data-testid="color-filter-title">
            COLOR
          </h3>
          <div className="flex flex-wrap gap-3">
            {availableColors.map((color) => (
              <button
                key={color.value}
                onClick={() => handleColorToggle(color.value)}
                className={`w-6 h-6 rounded-full border-2 transition-all hover:scale-110 ${
                  color.color
                } ${
                  filters.colors.includes(color.value)
                    ? "border-white ring-2 ring-primary ring-offset-2 ring-offset-gray-900"
                    : "border-gray-600"
                }`}
                title={color.name}
                data-testid={`color-${color.value}`}
              />
            ))}
          </div>
        </div>

        {/* Brand Summary */}
        <div className="mt-8">
          <h3 className="font-medium text-white mb-4" data-testid="brand-summary-title">
            BRAND
          </h3>
          <div className="space-y-3">
            {Object.entries(brands).map(([brand, count]) => (
              <div key={brand} className="flex items-center justify-between">
                <span className="text-sm text-gray-300">{brand}</span>
                <span className="text-xs text-gray-500">{count as number}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </aside>
  );
}

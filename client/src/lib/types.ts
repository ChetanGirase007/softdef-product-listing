export interface FilterState {
  brands: string[];
  colors: string[];
  priceRange: [number, number];
  category?: string;
}

export interface SortOption {
  value: 'name-asc' | 'name-desc' | 'price-asc' | 'price-desc' | 'popularity-desc';
  label: string;
}

export interface PaginationState {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
}

export const sortOptions: SortOption[] = [
  { value: 'name-asc', label: 'Name (A-Z)' },
  { value: 'name-desc', label: 'Name (Z-A)' },
  { value: 'price-asc', label: 'Price (Low to High)' },
  { value: 'price-desc', label: 'Price (High to Low)' },
  { value: 'popularity-desc', label: 'Popularity' },
];

export const availableColors = [
  { name: 'Red', value: 'red', color: 'bg-red-500' },
  { name: 'Blue', value: 'blue', color: 'bg-blue-500' },
  { name: 'Green', value: 'green', color: 'bg-green-500' },
  { name: 'Yellow', value: 'yellow', color: 'bg-yellow-500' },
  { name: 'Purple', value: 'purple', color: 'bg-purple-500' },
  { name: 'Pink', value: 'pink', color: 'bg-pink-500' },
  { name: 'White', value: 'white', color: 'bg-gray-200' },
  { name: 'Black', value: 'black', color: 'bg-gray-800' },
  { name: 'Brown', value: 'brown', color: 'bg-yellow-600' },
  { name: 'Gray', value: 'gray', color: 'bg-gray-500' },
  { name: 'Orange', value: 'orange', color: 'bg-orange-500' },
  { name: 'Navy', value: 'navy', color: 'bg-blue-900' },
  { name: 'Gold', value: 'gold', color: 'bg-yellow-400' },
];

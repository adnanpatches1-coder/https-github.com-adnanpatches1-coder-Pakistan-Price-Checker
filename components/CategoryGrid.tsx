import React from 'react';
import { CATEGORIES } from '../types';
import { Smartphone, Laptop, ShoppingBasket, Fuel, Coins, Shirt } from 'lucide-react';

interface CategoryGridProps {
  onSelectCategory: (query: string) => void;
  isLoading: boolean;
}

const iconMap: Record<string, React.ReactNode> = {
  smartphone: <Smartphone className="w-6 h-6" />,
  laptop: <Laptop className="w-6 h-6" />,
  'shopping-basket': <ShoppingBasket className="w-6 h-6" />,
  fuel: <Fuel className="w-6 h-6" />,
  coins: <Coins className="w-6 h-6" />,
  shirt: <Shirt className="w-6 h-6" />,
};

const CategoryGrid: React.FC<CategoryGridProps> = ({ onSelectCategory, isLoading }) => {
  return (
    <div className="max-w-4xl mx-auto px-4 mt-8">
      <h3 className="text-gray-500 font-semibold mb-4 text-sm uppercase tracking-wider">Popular Categories</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
        {CATEGORIES.map((cat) => (
          <button
            key={cat.id}
            onClick={() => onSelectCategory(cat.query)}
            disabled={isLoading}
            className="flex flex-col items-center justify-center p-4 bg-white rounded-xl shadow-sm border border-gray-100 hover:shadow-md hover:border-emerald-200 transition-all group"
          >
            <div className="text-emerald-600 mb-2 group-hover:scale-110 transition-transform">
              {iconMap[cat.icon]}
            </div>
            <span className="text-sm font-medium text-gray-700">{cat.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
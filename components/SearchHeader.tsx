import React, { useState } from 'react';
import { Search, Loader2, ScanLine } from 'lucide-react';
import { Scanner } from './Scanner';

interface SearchHeaderProps {
  onSearch: (query: string, image?: string) => void;
  isLoading: boolean;
}

const SearchHeader: React.FC<SearchHeaderProps> = ({ onSearch, isLoading }) => {
  const [query, setQuery] = useState('');
  const [isScannerOpen, setIsScannerOpen] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query);
    }
  };

  const handleScanCapture = (base64Image: string) => {
    setIsScannerOpen(false);
    onSearch(query, base64Image);
  };

  return (
    <>
      <div className="bg-gradient-to-br from-emerald-600 to-green-700 pb-12 pt-8 px-4 rounded-b-[2.5rem] shadow-xl text-white">
        <div className="max-w-4xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
              <span className="text-3xl">🇵🇰</span>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight">Pakistan Price Checker</h1>
          </div>
          <p className="text-emerald-100 mb-8 text-lg font-medium">
            Real-time market prices for Mobiles, Grocery, Gold, and more.
          </p>

          <form onSubmit={handleSubmit} className="relative max-w-2xl mx-auto">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search product or scan..."
              className="w-full pl-6 pr-28 py-4 rounded-full text-gray-800 text-lg shadow-lg focus:outline-none focus:ring-4 focus:ring-emerald-400/50 transition-all placeholder:text-gray-400"
              disabled={isLoading}
            />
            
            <div className="absolute right-2 top-2 bottom-2 flex gap-1">
              <button
                type="button"
                onClick={() => setIsScannerOpen(true)}
                disabled={isLoading}
                className="bg-gray-100 hover:bg-gray-200 text-gray-600 hover:text-emerald-600 p-3 rounded-full transition-colors flex items-center justify-center aspect-square group"
                title="Scan Product"
              >
                <ScanLine className="w-6 h-6 group-hover:scale-110 transition-transform" />
              </button>

              <button
                type="submit"
                disabled={isLoading}
                className="bg-emerald-600 hover:bg-emerald-500 text-white p-3 rounded-full transition-colors flex items-center justify-center aspect-square shadow-sm"
              >
                {isLoading ? <Loader2 className="w-6 h-6 animate-spin" /> : <Search className="w-6 h-6" />}
              </button>
            </div>
          </form>
        </div>
      </div>

      {isScannerOpen && (
        <Scanner 
          onCapture={handleScanCapture} 
          onClose={() => setIsScannerOpen(false)} 
        />
      )}
    </>
  );
};

export default SearchHeader;
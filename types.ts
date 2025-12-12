export interface PriceData {
  productName: string;
  averagePrice: string;
  priceRange: string;
  cheapOption: {
    name: string;
    price: string;
  };
  expensiveOption: {
    name: string;
    price: string;
  };
  trustedStores: string[];
  cityVariation: string;
  summary: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
}

export interface SearchResult {
  data: PriceData | null;
  rawText?: string;
  groundingSources?: GroundingChunk[];
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}

export const CATEGORIES = [
  { id: 'mobile', name: 'Mobiles', icon: 'smartphone', query: 'Latest Mobile Phone Prices' },
  { id: 'laptop', name: 'Laptops', icon: 'laptop', query: 'Laptop Prices in Pakistan' },
  { id: 'grocery', name: 'Grocery', icon: 'shopping-basket', query: 'Essential Grocery Prices Pakistan' },
  { id: 'fuel', name: 'Fuel', icon: 'fuel', query: 'Petrol Price Today Pakistan' },
  { id: 'gold', name: 'Gold', icon: 'coins', query: 'Gold Rate Today Pakistan' },
  { id: 'clothing', name: 'Clothing', icon: 'shirt', query: 'Clothing Brand Prices Pakistan' },
];
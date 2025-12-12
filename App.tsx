import React, { useState, useCallback } from 'react';
import SearchHeader from './components/SearchHeader';
import CategoryGrid from './components/CategoryGrid';
import PriceResult from './components/PriceResult';
import { getPriceInfo } from './services/geminiService';
import { SearchResult, LoadingState } from './types';

const App: React.FC = () => {
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [result, setResult] = useState<SearchResult | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // handleSearch now accepts an optional image string (base64)
  const handleSearch = useCallback(async (query: string, image?: string) => {
    setLoadingState(LoadingState.LOADING);
    setResult(null);
    setErrorMsg(null);

    try {
      const data = await getPriceInfo(query, image);
      setResult(data);
      setLoadingState(LoadingState.SUCCESS);
    } catch (error) {
      console.error(error);
      setErrorMsg("Unable to fetch prices at the moment. Please check your connection or API key.");
      setLoadingState(LoadingState.ERROR);
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      <SearchHeader 
        onSearch={handleSearch} 
        isLoading={loadingState === LoadingState.LOADING} 
      />

      {loadingState === LoadingState.IDLE && (
        <CategoryGrid 
          onSelectCategory={(catQuery) => handleSearch(catQuery)} 
          isLoading={false} 
        />
      )}

      {loadingState === LoadingState.LOADING && (
        <div className="flex flex-col items-center justify-center mt-20 text-emerald-600">
           <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
           <p className="font-medium animate-pulse">Scanning Pakistani markets...</p>
        </div>
      )}

      {loadingState === LoadingState.ERROR && (
        <div className="max-w-md mx-auto mt-12 bg-red-50 text-red-700 p-6 rounded-xl border border-red-200 text-center shadow-sm">
          <p className="font-semibold mb-1">Error</p>
          <p>{errorMsg}</p>
        </div>
      )}

      {loadingState === LoadingState.SUCCESS && result && (
        <PriceResult result={result} />
      )}
      
      {/* Footer */}
      <div className="fixed bottom-0 w-full bg-white border-t border-gray-100 py-3 text-center text-xs text-gray-400 z-10">
        Prices are estimates based on real-time web search. Always verify with local sellers.
      </div>
    </div>
  );
};

export default App;
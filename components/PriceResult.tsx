import React from 'react';
import { SearchResult, PriceData } from '../types';
import { TrendingDown, TrendingUp, MapPin, Store, ExternalLink, AlertCircle } from 'lucide-react';

interface PriceResultProps {
  result: SearchResult;
}

const PriceResult: React.FC<PriceResultProps> = ({ result }) => {
  const { data, rawText, groundingSources } = result;

  // Fallback if JSON parsing failed but we have text
  if (!data && rawText) {
    return (
      <div className="max-w-4xl mx-auto mt-8 px-4">
        <div className="bg-white rounded-2xl shadow-lg p-6 border border-gray-100">
           <h3 className="text-xl font-bold text-gray-800 mb-4">Search Result</h3>
           <div className="prose max-w-none urdu-text text-right text-lg whitespace-pre-wrap">
             {rawText}
           </div>
           {groundingSources && groundingSources.length > 0 && (
            <div className="mt-6 pt-4 border-t border-gray-100">
              <h4 className="text-sm font-semibold text-gray-500 mb-2">Sources</h4>
              <div className="flex flex-wrap gap-2">
                {groundingSources.map((source, idx) => (
                  source.web?.uri ? (
                    <a
                      key={idx}
                      href={source.web.uri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-xs bg-gray-100 hover:bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full flex items-center gap-1 transition-colors"
                    >
                      <ExternalLink className="w-3 h-3" />
                      {source.web.title || new URL(source.web.uri).hostname}
                    </a>
                  ) : null
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!data) return null;

  return (
    <div className="max-w-4xl mx-auto mt-8 px-4 mb-16 animate-fade-in-up">
      {/* Main Price Card */}
      <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100 mb-6">
        <div className="bg-emerald-50 p-6 md:p-8 text-center border-b border-emerald-100">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-800 mb-2">{data.productName}</h2>
          <div className="text-4xl md:text-5xl font-extrabold text-emerald-700 my-4">
            {data.averagePrice}
          </div>
          <p className="text-gray-500 font-medium">Average Market Price</p>
          <div className="inline-block mt-2 bg-emerald-200 text-emerald-800 px-3 py-1 rounded-full text-sm font-semibold">
            Range: {data.priceRange}
          </div>
        </div>
        
        {/* Summary Section */}
        <div className="p-6 md:p-8 bg-white">
           <div className="flex items-start gap-3">
             <div className="bg-emerald-100 p-2 rounded-lg text-emerald-600 shrink-0 mt-1">
               <AlertCircle className="w-5 h-5" />
             </div>
             <div className="urdu-text text-lg text-gray-700 leading-relaxed text-right w-full" dir="rtl">
               {data.summary}
             </div>
           </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6 mb-6">
        {/* Cheap Option */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-green-500">
          <div className="flex items-center gap-2 mb-3 text-green-600">
            <TrendingDown className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wide text-sm">Best Budget Option</h3>
          </div>
          <div className="text-xl font-bold text-gray-800">{data.cheapOption?.name}</div>
          <div className="text-lg text-green-700 font-semibold mt-1">{data.cheapOption?.price}</div>
        </div>

        {/* Expensive Option */}
        <div className="bg-white p-6 rounded-2xl shadow-md border-l-4 border-orange-500">
          <div className="flex items-center gap-2 mb-3 text-orange-600">
            <TrendingUp className="w-5 h-5" />
            <h3 className="font-bold uppercase tracking-wide text-sm">Premium Option</h3>
          </div>
          <div className="text-xl font-bold text-gray-800">{data.expensiveOption?.name}</div>
          <div className="text-lg text-orange-700 font-semibold mt-1">{data.expensiveOption?.price}</div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Trusted Stores */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-2 mb-4 text-emerald-700 border-b border-gray-100 pb-2">
            <Store className="w-5 h-5" />
            <h3 className="font-bold">Trusted Stores</h3>
          </div>
          <ul className="space-y-2">
            {data.trustedStores?.map((store, idx) => (
              <li key={idx} className="flex items-center gap-2 text-gray-700">
                <span className="w-2 h-2 bg-emerald-400 rounded-full"></span>
                {store}
              </li>
            ))}
          </ul>
        </div>

        {/* City Variations */}
        <div className="bg-white p-6 rounded-2xl shadow-md">
          <div className="flex items-center gap-2 mb-4 text-emerald-700 border-b border-gray-100 pb-2">
            <MapPin className="w-5 h-5" />
            <h3 className="font-bold">City Variations</h3>
          </div>
           <p className="text-gray-700 urdu-text text-right text-lg leading-relaxed" dir="rtl">
             {data.cityVariation}
           </p>
        </div>
      </div>

      {/* Grounding Sources Footer */}
      {groundingSources && groundingSources.length > 0 && (
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-400 uppercase tracking-widest mb-3">Verified Information Sources</p>
          <div className="flex flex-wrap justify-center gap-2">
             {groundingSources.map((source, idx) => (
               source.web?.uri ? (
                <a
                  key={idx}
                  href={source.web.uri}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:text-emerald-600 hover:border-emerald-300 transition-colors shadow-sm"
                >
                  <ExternalLink className="w-3 h-3" />
                  {source.web.title || new URL(source.web.uri).hostname.replace('www.', '')}
                </a>
               ) : null
             ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceResult;
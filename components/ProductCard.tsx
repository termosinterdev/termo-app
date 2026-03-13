import React from 'react';
import { Product } from '../types';
import { ArrowRight } from 'lucide-react';

interface ProductCardProps {
  product: Product;
  navigate: (route: string) => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, navigate }) => {
  return (
    <div 
      onClick={() => navigate(`product/${product.id}`)}
      className="group bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full cursor-pointer"
    >
      <div className="relative h-48 overflow-hidden bg-gray-100">
        <img 
          src={product.images[0]} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700 grayscale group-hover:grayscale-0"
        />
        <div className="absolute top-3 left-3">
          <span className="px-2 py-1 bg-termo-dark text-termo-yellow text-[10px] font-bold uppercase tracking-wider rounded">
            {product.category}
          </span>
        </div>
      </div>
      <div className="p-4 flex flex-col flex-grow mb-2">
        <div className="flex justify-between items-start mb-1">
           <h3 className="text-lg font-display font-bold text-termo-dark group-hover:text-termo-yellowDark transition-colors line-clamp-2 leading-tight">
            {product.name}
           </h3>
        </div>
        
        <p className="text-xs text-gray-500 font-mono truncate">{product.material}</p>
        
        {product.price && (() => {
          const match = product.price.match(/^(.*?)((?:R\$\s*)?[\d.,]+)(.*)$/i);
          const prefix = match ? match[1] : '';
          const priceVal = match ? match[2] : product.price;
          const suffix = match ? match[3] : '';
          return (
            <div className="flex items-baseline mb-2 flex-wrap">
              {prefix.trim() && <span className="text-xs font-bold text-termo-dark mr-1">{prefix.trim()}</span>}
              <span className="text-termo-yellowDark font-bold text-base">{priceVal}</span>
              {suffix.trim() && <span className="text-xs text-gray-500 ml-1">{suffix.trim()}</span>}
            </div>
          );
        })()}
        
        <p className="text-gray-600 text-xs leading-snug mb-2 flex-grow line-clamp-3">
          {product.description}
        </p>
        <div className="mt-auto border-t border-gray-100 pt-2 flex items-center justify-between text-termo-dark group-hover:text-termo-yellowDark transition-colors">
          <span className="text-xs font-bold uppercase">Ver Detalhes</span>
          <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
        </div>
      </div>
    </div>
  );
};
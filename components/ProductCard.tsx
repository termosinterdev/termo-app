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
      className="group bg-white border border-gray-200 overflow-hidden flex flex-col h-full cursor-pointer relative transition-all duration-300 hover:border-termo-yellow hover:shadow-lg shadow-sm"
    >
      {/* Image Area */}
      <div className="relative h-48 overflow-hidden bg-gray-100 flex-shrink-0">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover transition-all duration-700 group-hover:scale-105"
        />
        {/* Subtle overlay on hover */}
        <div className="absolute inset-0 bg-termo-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Category badge */}
        <div className="absolute top-3 left-3 z-10">
          <span className="px-2.5 py-1 bg-termo-dark text-termo-yellow text-[10px] font-mono font-black uppercase tracking-widest shadow-md">
            {product.category}
          </span>
        </div>

        {/* Yellow accent bar on top */}
        <div className="absolute top-0 left-0 w-full h-1 bg-termo-yellow" />
      </div>

      {/* Content Area */}
      <div className="p-5 flex flex-col flex-grow">
        <h3 className="text-base font-display font-black text-termo-dark group-hover:text-termo-dark transition-colors leading-tight mb-1 line-clamp-2">
          {product.name}
        </h3>

        {product.material && (
          <p className="text-xs text-gray-500 font-mono truncate mb-2">
            {product.material}
          </p>
        )}

        {product.price && (() => {
          const match = product.price.match(/^(.*?)((?:R\$\s*)?[\d.,]+)(.*)$/i);
          const prefix = match ? match[1] : '';
          const priceVal = match ? match[2] : product.price;
          const suffix = match ? match[3] : '';
          return (
            <div className="flex items-baseline mb-3 flex-wrap">
              {prefix.trim() && <span className="text-xs font-bold text-gray-500 mr-1">{prefix.trim()}</span>}
              <span className="text-termo-yellowDark font-black text-lg">{priceVal}</span>
              {suffix.trim() && <span className="text-xs text-gray-500 ml-1">{suffix.trim()}</span>}
            </div>
          );
        })()}

        <p className="text-gray-600 text-xs leading-relaxed flex-grow line-clamp-3 mb-4">
          {product.description}
        </p>

        {/* CTA row */}
        <div className="mt-auto border-t border-gray-100 pt-3 flex items-center justify-between">
          <span className="text-xs font-black uppercase tracking-widest text-gray-400 group-hover:text-termo-yellow transition-colors duration-200">
            Ver Detalhes
          </span>
          <ArrowRight
            size={16}
            className="text-gray-400 group-hover:text-termo-yellow group-hover:translate-x-1 transition-all duration-200"
          />
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Product } from '../types';
import { getFullProductCode } from './DimensionCard';

interface ProductCodeBadgesProps {
  product?: Product | null;
  code?: string;
  codigoligacaoproduto?: string;
  name?: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
  dark?: boolean;
}

export function extractProductCodeParts(
  product?: Product | null,
  fallbackCode?: string,
  fallbackLigacao?: string,
  fallbackName?: string
): { numericCode: string; dimTag: string; fullCode: string } {
  const effectiveCode = product?.code || fallbackCode || '';
  const effectiveName = product?.name || fallbackName || '';
  const { fullCode, tag } = getFullProductCode(effectiveCode, effectiveName);

  const baseFromCode = fullCode && fullCode !== 'S/C' ? fullCode.split('-')[0] : '';
  const numericCode = (product?.codigoligacaoproduto || fallbackLigacao || baseFromCode || '').trim();

  // Dimensão após o hífen (STD, 2X, 3X, etc.)
  let dimTag = tag?.trim() || '';
  if (!dimTag && fullCode.includes('-')) {
    dimTag = fullCode.split('-')[1]?.trim() || '';
  }
  if (dimTag === 'S/C') dimTag = '';

  return { numericCode, dimTag, fullCode };
}

export const ProductCodeBadges: React.FC<ProductCodeBadgesProps> = ({
  product,
  code,
  codigoligacaoproduto,
  name,
  size = 'sm',
  className = '',
  dark = false,
}) => {
  const { numericCode, dimTag } = extractProductCodeParts(
    product,
    code,
    codigoligacaoproduto,
    name
  );

  if (!numericCode && !dimTag) return null;

  const sizeClasses = {
    sm: 'text-[11px] px-2 py-0.5',
    md: 'text-xs px-2.5 py-1',
    lg: 'text-sm px-3.5 py-1.5'
  }[size];

  return (
    <div className={`flex flex-wrap items-center gap-1.5 ${className}`}>
      {/* 1. Tag numérica laranja em destaque */}
      {numericCode && (
        <span
          title="Código do produto"
          className={`inline-flex items-center font-mono font-black border rounded tracking-wide select-none ${sizeClasses} ${
            dark
              ? 'bg-amber-500/20 border-amber-400 text-amber-300'
              : 'bg-amber-100/90 border-amber-400 text-amber-950 shadow-xs'
          }`}
        >
          {numericCode}
        </span>
      )}

      {/* 2. Tag cinza em negrito chamativo para a dimensão (STD / 2X / 3X...) */}
      {dimTag && (
        <span
          title="Dimensão / Variante"
          className={`inline-flex items-center font-mono font-black border rounded tracking-wide select-none ${sizeClasses} ${
            dark
              ? 'bg-white/10 border-white/20 text-gray-200'
              : 'bg-gray-100 border-gray-300 text-gray-800'
          }`}
        >
          {dimTag}
        </span>
      )}
    </div>
  );
};

import React, { useEffect, useMemo } from 'react';
import { Product } from '../types';
import { ArrowRight, Car, Info, ShieldCheck, Ruler, X } from 'lucide-react';
import { 
  DIMENSION_LABELS,
  DIMENSION_ALIASES,
  extractProductMeta, 
  getCleanProductName 
} from './DimensionCard';
import { ProductCodeBadges } from './ProductCodeBadges';

interface ProductQuickViewModalProps {
  product: Product;
  onClose: () => void;
  navigate: (route: string) => void;
}

export const ProductQuickViewModal: React.FC<ProductQuickViewModalProps> = ({
  product,
  onClose,
  navigate
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  const cleanTitle = getCleanProductName(product.name);
  const meta = useMemo(() => extractProductMeta(product), [product]);

  // Extração de cotas dimensionais principais
  const dimensionEntries = useMemo(() => {
    const entries: { key: string; label: string; short: string; val: string }[] = [];
    const processed = new Set<string>();

    let parsedSpecs: any = product.specs;
    if (typeof parsedSpecs === 'string') {
      try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
    }

    Object.entries(DIMENSION_LABELS).forEach(([dimKey, dimMeta]) => {
      const val = (product as any)[dimKey] ||
                  (product.dimensions && (product.dimensions as any)[dimKey]) ||
                  (parsedSpecs && typeof parsedSpecs === 'object' && parsedSpecs[dimKey]);
      const isZero = val === '0' || val === '0.0' || val === '0.000' || parseFloat(String(val)) === 0;
      if (val !== null && val !== undefined && String(val).trim() !== '' && !isZero) {
        processed.add(dimKey);
        entries.push({ key: dimKey, label: dimMeta.label, short: dimMeta.short, val: String(val) });
      }
    });

    const source = product.dimensions || parsedSpecs;
    if (source && typeof source === 'object') {
      Object.entries(source).forEach(([rawKey, rawVal]) => {
        const normalizedKey = rawKey.toLowerCase().replace(/[\s\-_.]/g, '');
        const standardKey = DIMENSION_ALIASES[normalizedKey];
        if (standardKey && !processed.has(standardKey)) {
          const dimMeta = DIMENSION_LABELS[standardKey];
          const isZero = rawVal === '0' || rawVal === '0.0' || rawVal === '0.000' || parseFloat(String(rawVal)) === 0;
          if (dimMeta && rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '' && !isZero) {
            processed.add(standardKey);
            entries.push({ key: standardKey, label: dimMeta.label, short: dimMeta.short, val: String(rawVal) });
          }
        }
      });
    }

    return entries;
  }, [product]);

  const handleGoToProduct = () => {
    onClose();
    navigate(`product/${product.id}`);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-sm animate-fadeIn"
      onClick={onClose}
    >
      <div 
        className="bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Barra amarela superior */}
        <div className="h-1.5 bg-termo-yellow w-full" />

        {/* Cabeçalho Escuro */}
        <div className="bg-[#0f0f0f] border-b border-gray-800 p-5 sm:p-6 text-white flex items-start justify-between gap-4">
          <div className="space-y-1.5 flex-1 pr-2">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-termo-yellow" />
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-termo-yellow/90">
                Visualização Rápida • Catálogo Técnico
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-display font-black text-white leading-tight">
              {cleanTitle}
            </h2>
            <ProductCodeBadges product={product} dark size="md" className="pt-0.5" />
          </div>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors flex-shrink-0 mt-0.5"
          >
            <X size={20} />
          </button>
        </div>

        {/* Corpo do Modal */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">

          {/* 1. Informações Técnicas Gerais (Apenas Material e Peso Líquido) */}
          {(meta.material || meta.pesoliquido) && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                <Info size={16} className="text-termo-yellowDark" />
                <h3 className="text-xs font-black uppercase tracking-wider text-termo-dark">
                  Informações Gerais
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {meta.material && (
                  <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Material
                    </span>
                    <span className="text-sm font-black text-termo-dark">
                      {meta.material}
                    </span>
                  </div>
                )}

                {meta.pesoliquido && (
                  <div className="bg-gray-50 border border-gray-200 p-3.5 rounded-xl">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">
                      Peso Líquido
                    </span>
                    <span className="text-sm font-mono font-bold text-termo-dark">
                      {meta.pesoliquido} kg
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* 2. Montadoras em caixinhas bonitinhas com cursor normal */}
          {meta.montadorasList && meta.montadorasList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                <Car size={16} className="text-termo-yellowDark" />
                <h3 className="text-xs font-black uppercase tracking-wider text-termo-dark">
                  Montadoras Compatíveis ({meta.montadorasList.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {meta.montadorasList.map((montadora, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold text-gray-800 uppercase tracking-wider shadow-sm cursor-default select-none"
                  >
                    {montadora}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 3. Marca / Sistema em caixinhas bonitinhas com cursor normal */}
          {meta.marcasList && meta.marcasList.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                <ShieldCheck size={16} className="text-termo-yellowDark" />
                <h3 className="text-xs font-black uppercase tracking-wider text-termo-dark">
                  Marca / Sistema ({meta.marcasList.length})
                </h3>
              </div>
              <div className="flex flex-wrap gap-2">
                {meta.marcasList.map((marca, idx) => (
                  <span
                    key={idx}
                    className="px-3.5 py-2 bg-gray-50 border border-gray-200 rounded-xl text-xs font-mono font-bold text-termo-dark shadow-sm cursor-default select-none"
                  >
                    {marca}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* 4. Dimensões Básicas da Peça */}
          {dimensionEntries.length > 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 pb-1.5 border-b border-gray-100">
                <Ruler size={16} className="text-termo-yellowDark" />
                <h3 className="text-xs font-black uppercase tracking-wider text-termo-dark">
                  Dimensões Principais (mm)
                </h3>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                {dimensionEntries.slice(0, 4).map((d, idx) => (
                  <div 
                    key={idx} 
                    className="bg-gray-50 border border-gray-200 p-2.5 rounded-lg flex flex-col cursor-default select-none"
                  >
                    <span className="text-[10px] text-gray-500 truncate" title={d.label}>
                      {d.short}
                    </span>
                    <span className="text-xs font-mono font-black text-termo-dark mt-0.5">
                      {d.val}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Botão de Destaque: Ver Dimensões Completas e Aplicações do Produto */}
          <button
            type="button"
            onClick={handleGoToProduct}
            className="w-full flex items-center justify-center gap-2 py-3.5 px-6 bg-termo-yellow hover:bg-termo-yellowDark text-termo-dark font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md group mt-2"
          >
            <span>Ver dimensões completas e aplicações do produto</span>
            <ArrowRight size={16} className="transform group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Rodapé */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs uppercase tracking-wider font-bold text-gray-700 hover:text-termo-dark bg-white hover:bg-gray-100 rounded-lg transition-colors border border-gray-300 shadow-sm"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

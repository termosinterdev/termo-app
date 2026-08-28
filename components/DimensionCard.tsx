import React from 'react';
import { Product } from '../types';
import { Ruler, Tag, Star } from 'lucide-react';

interface DimensionCardProps {
  product: Product;
  navigate: (route: string) => void;
  onOpenDetail?: () => void;
}

export const GENERIC_DIMENSION_IMG = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?auto=format&fit=crop&w=600&q=80';

export const DIMENSION_LABELS: Record<string, { label: string; short: string }> = {
  dintmin: { label: 'Diâmetro interno mínimo', short: 'Ø int. mín' },
  dintmax: { label: 'Diâmetro interno máximo', short: 'Ø int. máx' },
  dextmin: { label: 'Diâmetro externo mínimo', short: 'Ø ext. mín' },
  dextmax: { label: 'Diâmetro externo máximo', short: 'Ø ext. máx' },
  htmin:   { label: 'Altura total mínima', short: 'Alt. tot. mín' },
  htmax:   { label: 'Altura total máxima', short: 'Alt. tot. máx' },
  dflmin:  { label: 'Diâmetro flange mínimo', short: 'Ø flange mín' },
  dflmax:  { label: 'Diâmetro flange máximo', short: 'Ø flange máx' },
  hflmin:  { label: 'Altura flange mínimo', short: 'Alt. flange mín' },
  hflmax:  { label: 'Altura flange máxima', short: 'Alt. flange máx' },
  desfmin: { label: 'Diâmetro esférico mínimo', short: 'Ø esférico mín' },
  desfmax: { label: 'Diâmetro esférico máximo', short: 'Ø esférico máx' },
  dpesmin: { label: 'Diâmetro pescoço mínimo', short: 'Ø pescoço mín' },
  dpesmax: { label: 'Diâmetro pescoço máximo', short: 'Ø pescoço máx' },
  hpesmin: { label: 'Altura pescoço mínimo', short: 'Alt. pescoço mín' },
  hpesmax: { label: 'Altura pescoço máximo', short: 'Alt. pescoço máx' }
};

export const DIMENSION_ALIASES: Record<string, string> = {
  dintmin: 'dintmin', dint_min: 'dintmin', 'd.int.min': 'dintmin', diametro_interno_minimo: 'dintmin', diametro_interno_min: 'dintmin',
  dintmax: 'dintmax', dint_max: 'dintmax', 'd.int.max': 'dintmax', diametro_interno_maximo: 'dintmax', diametro_interno_max: 'dintmax',
  dextmin: 'dextmin', dext_min: 'dextmin', 'd.ext.min': 'dextmin', diametro_externo_minimo: 'dextmin', diametro_externo_min: 'dextmin',
  dextmax: 'dextmax', dext_max: 'dextmax', 'd.ext.max': 'dextmax', diametro_externo_maximo: 'dextmax', diametro_externo_max: 'dextmax',
  htmin: 'htmin', ht_min: 'htmin', 'h.t.min': 'htmin', altura_total_minima: 'htmin', altura_total_min: 'htmin', altura_min: 'htmin',
  htmax: 'htmax', ht_max: 'htmax', 'h.t.max': 'htmax', altura_total_maxima: 'htmax', altura_total_max: 'htmax', altura_max: 'htmax',
  dflmin: 'dflmin', dfl_min: 'dflmin', diametro_flange_minimo: 'dflmin', diametro_flange_min: 'dflmin',
  dflmax: 'dflmax', dfl_max: 'dflmax', diametro_flange_maximo: 'dflmax', diametro_flange_max: 'dflmax',
  hflmin: 'hflmin', hfl_min: 'hflmin', altura_flange_minima: 'hflmin', altura_flange_min: 'hflmin',
  hflmax: 'hflmax', hfl_max: 'hflmax', altura_flange_maxima: 'hflmax', altura_flange_max: 'hflmax',
  desfmin: 'desfmin', desf_min: 'desfmin', diametro_esferico_minimo: 'desfmin', diametro_esferico_min: 'desfmin',
  desfmax: 'desfmax', desf_max: 'desfmax', diametro_esferico_maximo: 'desfmax', diametro_esferico_max: 'desfmax',
  dpesmin: 'dpesmin', dpes_min: 'dpesmin', diametro_pescoco_minimo: 'dpesmin', diametro_pescoco_min: 'dpesmin',
  dpesmax: 'dpesmax', dpes_max: 'dpesmax', diametro_pescoco_maximo: 'dpesmax', diametro_pescoco_max: 'dpesmax',
  hpesmin: 'hpesmin', hpes_min: 'hpesmin', altura_pescoco_minima: 'hpesmin', altura_pescoco_min: 'hpesmin',
  hpesmax: 'hpesmax', hpes_max: 'hpesmax', altura_pescoco_maxima: 'hpesmax', altura_pescoco_max: 'hpesmax',
};

export const DimensionCard: React.FC<DimensionCardProps> = ({ product, navigate, onOpenDetail }) => {
  const dimensionEntries: { key: string; label: string; short: string; val: string }[] = [];
  const processedKeys = new Set<string>();

  // Parse specs if it's a string
  let parsedSpecs: any = product.specs;
  if (typeof parsedSpecs === 'string') {
    try {
      parsedSpecs = JSON.parse(parsedSpecs);
    } catch {
      parsedSpecs = {};
    }
  }

  // 1. Checa as 16 dimensões padronizadas diretamente nos campos
  Object.entries(DIMENSION_LABELS).forEach(([dimKey, meta]) => {
    const val = (product as any)[dimKey] || 
                (product.dimensions && (product.dimensions as any)[dimKey]) || 
                (parsedSpecs && typeof parsedSpecs === 'object' && parsedSpecs[dimKey]);
    if (val !== null && val !== undefined && String(val).trim() !== '') {
      processedKeys.add(dimKey);
      dimensionEntries.push({
        key: dimKey,
        label: meta.label,
        short: meta.short,
        val: String(val)
      });
    }
  });

  // 2. Se houver specs/dimensions, checa exclusivamente por aliases dimensionais conhecidos
  const source = product.dimensions || parsedSpecs;
  if (source && typeof source === 'object') {
    Object.entries(source).forEach(([rawKey, rawVal]) => {
      const normalizedKey = rawKey.toLowerCase().replace(/[\s\-_.]/g, '');
      const standardKey = DIMENSION_ALIASES[normalizedKey];
      if (standardKey && !processedKeys.has(standardKey)) {
        const meta = DIMENSION_LABELS[standardKey];
        if (meta && rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '') {
          processedKeys.add(standardKey);
          dimensionEntries.push({
            key: standardKey,
            label: meta.label,
            short: meta.short,
            val: String(rawVal)
          });
        }
      }
    });
  }

  const handleClick = () => {
    if (onOpenDetail) {
      onOpenDetail();
    } else {
      navigate(`product/${product.id}`);
    }
  };

  const productImage = (product.images && product.images.length > 0 && product.images[0]) 
    ? product.images[0] 
    : GENERIC_DIMENSION_IMG;

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-200 hover:border-termo-yellow flex flex-col h-auto cursor-pointer"
    >
      {/* Top Banner with Product Image (1:1 Square Cropped) */}
      <div className="relative aspect-square w-full bg-gray-100 overflow-hidden flex items-center justify-center border-b border-gray-100">
        <img 
          src={productImage} 
          alt={product.name} 
          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
        />
        
        {/* Category Badge */}
        <div className="absolute top-3 left-3 flex gap-2">
          <span className="px-2.5 py-1 bg-termo-dark/90 text-termo-yellow text-[11px] font-bold uppercase tracking-wider rounded backdrop-blur-sm shadow">
            {product.category || 'Peça Sinterizada'}
          </span>
        </div>

        {/* Favorite Badge */}
        {product.isFavorite && (
          <div className="absolute bottom-2 right-2 bg-black/60 backdrop-blur-sm text-termo-yellow text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded shadow flex items-center gap-1 border border-white/10">
            <Star size={12} fill="currentColor" className="text-termo-yellow" />
            <span>Destaque</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col">
        {/* Code */}
        {product.code && (
          <div className="flex items-center gap-1.5 text-xs font-mono text-termo-yellowDark font-bold mb-1">
            <Tag size={13} />
            <span>{product.code}</span>
          </div>
        )}

        {/* Name */}
        <h3 className={`text-base font-display font-bold text-termo-dark group-hover:text-termo-yellowDark transition-colors line-clamp-2 ${dimensionEntries.length > 0 ? 'mb-3' : 'mb-0'}`}>
          {product.name}
        </h3>

        {/* Dimension specs table */}
        {dimensionEntries.length > 0 && (
          <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 mt-2">
            <div className="text-[11px] font-bold uppercase text-gray-500 tracking-wider mb-2 flex items-center gap-1">
              <Ruler size={12} />
              <span>Medidas e Dimensões</span>
            </div>
            <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
              {dimensionEntries.map((dim, idx) => (
                <div key={idx} className="flex justify-between items-center text-xs py-1.5 border-b border-gray-200/60 last:border-0" title={dim.key}>
                  <span className="text-gray-700 font-medium text-xs pr-2">
                    {dim.label}:
                  </span>
                  <span className="text-termo-dark font-mono font-bold text-xs flex-shrink-0">
                    {dim.val}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

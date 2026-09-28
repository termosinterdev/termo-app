import React from 'react';
import { Product } from '../types';
import { Ruler, Star, Car, ChevronRight, Info } from 'lucide-react';
import { ProductCodeBadges } from './ProductCodeBadges';

interface DimensionCardProps {
  product: Product;
  navigate: (route: string) => void;
  onOpenDetail?: () => void;
}

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

// Formata obrigatoriamente como code-tagDimensao (ex: 0212-STD, 1724-STD, 1724-2X)
export function getFullProductCode(code?: string, name?: string): { fullCode: string; tag: string } {
  if (!code) return { fullCode: 'S/C', tag: 'STD' };
  const trimmed = code.trim();
  const match = trimmed.match(/-(STD|[0-9]+X|LUMAG|[\w]+)$/i);
  if (match) {
    return { fullCode: trimmed, tag: match[1].toUpperCase() };
  }
  if (name) {
    const nameMatch = name.match(/-(STD|[0-9]+X|LUMAG|[\w]+)$/i);
    if (nameMatch) {
      return { fullCode: `${trimmed}-${nameMatch[1].toUpperCase()}`, tag: nameMatch[1].toUpperCase() };
    }
  }
  // Se terminar em 02, 03... (ex: 172403 -> 1724-3X)
  if (trimmed.length > 4 && /0[2-9]$/.test(trimmed)) {
    const base = trimmed.slice(0, -2);
    const suffix = parseInt(trimmed.slice(-2), 10) + 'X';
    return { fullCode: `${base}-${suffix}`, tag: suffix };
  }
  return { fullCode: `${trimmed}-STD`, tag: 'STD' };
}

// Remove tag de dimensão do título (ex: KIT 0212-2001-STD -> KIT 0212-2001)
export function getCleanProductName(name?: string): string {
  if (!name) return 'Produto';
  return name
    .replace(/-(?:STD|[0-9]+X|LUMAG|[\w]+)$/i, '')
    .replace(/\s+(?:STD|[0-9]+X)$/i, '')
    .trim();
}

// Extrai metadados completos de um produto
export function extractProductMeta(product: Product) {
  let parsedSpecs: any = product.specs;
  if (typeof parsedSpecs === 'string') {
    try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
  }

  // Material
  let material = '';
  if (product.material && product.material.trim() && product.material.toLowerCase() !== 'diversos') {
    material = product.material.trim().toUpperCase();
  }
  if (!material && parsedSpecs && typeof parsedSpecs === 'object') {
    for (const [k, v] of Object.entries(parsedSpecs)) {
      if (/^material/i.test(k.trim()) && v) {
        const str = String(v).trim().toUpperCase();
        material = str === 'BR' ? 'BRONZE' : str === 'FE' ? 'FERRO' : str;
        break;
      }
    }
  }

  // Montadora e Marca
  const montadorasSet = new Set<string>();
  const marcasSet = new Set<string>();
  const aplicacoesList: string[] = [];

  const addMontadoras = (raw: any) => {
    if (!raw) return;
    String(raw).split(/[,;/|]+/).map(s => s.trim()).filter(Boolean).forEach(m => montadorasSet.add(m));
  };
  const addMarcas = (raw: any) => {
    if (!raw) return;
    String(raw).split(/[,;/|]+/).map(s => s.trim()).filter(Boolean).forEach(m => marcasSet.add(m));
  };

  if (parsedSpecs && typeof parsedSpecs === 'object') {
    if (parsedSpecs.montadora) addMontadoras(parsedSpecs.montadora);
    if (parsedSpecs.marca) addMarcas(parsedSpecs.marca);

    if (Array.isArray(parsedSpecs.aplicacoes)) {
      parsedSpecs.aplicacoes.forEach((app: any) => {
        if (app.montadora) addMontadoras(app.montadora);
        if (app.marca) addMarcas(app.marca);
        if (app.descricao) {
          const desc = String(app.descricao).trim();
          const prefix = app.montadora ? `${app.montadora}: ` : '';
          aplicacoesList.push(`${prefix}${desc}`);
        }
      });
    }

    Object.entries(parsedSpecs).forEach(([k, v]) => {
      if (/aplica/i.test(k) && typeof v === 'string') {
        aplicacoesList.push(v.trim());
      }
    });
  }

  if (product.applied && product.applied.trim()) {
    const parts = product.applied.split('|').map(s => s.trim()).filter(Boolean);
    parts.forEach(p => {
      if (!aplicacoesList.includes(p)) aplicacoesList.push(p);
    });
  }

  const montadorasList = Array.from(montadorasSet).filter(Boolean);
  const marcasList = Array.from(marcasSet).filter(Boolean);
  const montadora = montadorasList.join(', ');
  const marca = marcasList.join(', ');
  const codigobarra = product.codigobarra || parsedSpecs?.codigo_barra || '';
  let pesoliquido = product.pesoliquido || parsedSpecs?.peso_liquido || '';
  if (pesoliquido === '0.00000' || pesoliquido === '0' || pesoliquido === '0.0') {
    pesoliquido = '';
  }

  return {
    material,
    montadora,
    marca,
    montadorasList,
    marcasList,
    codigobarra,
    pesoliquido,
    aplicacoes: Array.from(new Set(aplicacoesList))
  };
}

export const DimensionCard: React.FC<DimensionCardProps> = ({ product, navigate, onOpenDetail }) => {
  const dimensionEntries: { key: string; label: string; short: string; val: string }[] = [];
  const processedKeys = new Set<string>();

  let parsedSpecs: any = product.specs;
  if (typeof parsedSpecs === 'string') {
    try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
  }

  // Medidas padronizadas
  Object.entries(DIMENSION_LABELS).forEach(([dimKey, meta]) => {
    const val = (product as any)[dimKey] || 
                (product.dimensions && (product.dimensions as any)[dimKey]) || 
                (parsedSpecs && typeof parsedSpecs === 'object' && parsedSpecs[dimKey]);
    const isZero = val === '0' || val === '0.0' || val === '0.000' || parseFloat(String(val)) === 0;
    if (val !== null && val !== undefined && String(val).trim() !== '' && !isZero) {
      processedKeys.add(dimKey);
      dimensionEntries.push({ key: dimKey, label: meta.label, short: meta.short, val: String(val) });
    }
  });

  const source = product.dimensions || parsedSpecs;
  if (source && typeof source === 'object') {
    Object.entries(source).forEach(([rawKey, rawVal]) => {
      const normalizedKey = rawKey.toLowerCase().replace(/[\s\-_.]/g, '');
      const standardKey = DIMENSION_ALIASES[normalizedKey];
      if (standardKey && !processedKeys.has(standardKey)) {
        const meta = DIMENSION_LABELS[standardKey];
        const isZero = rawVal === '0' || rawVal === '0.0' || rawVal === '0.000' || parseFloat(String(rawVal)) === 0;
        if (meta && rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '' && !isZero) {
          processedKeys.add(standardKey);
          dimensionEntries.push({ key: standardKey, label: meta.label, short: meta.short, val: String(rawVal) });
        }
      }
    });
  }

  const cleanTitle = getCleanProductName(product.name);
  const meta = extractProductMeta(product);

  const handleClick = () => {
    if (onOpenDetail) {
      onOpenDetail();
    } else {
      navigate(`product/${product.id}`);
    }
  };

  const hasInfo = Boolean(meta.material || meta.pesoliquido);

  return (
    <div 
      onClick={handleClick}
      className="group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-200 hover:border-termo-yellow flex flex-col h-full cursor-pointer"
    >
      <div className="p-4 sm:p-5 flex flex-col flex-1 justify-between gap-4">
        <div>
          {/* Header: tags + destaque */}
          <div className="flex items-start justify-between gap-2 mb-2">
            <ProductCodeBadges product={product} />

            {product.isFavorite && (
              <span className="flex items-center gap-1 text-[10px] font-bold text-termo-yellowDark bg-amber-50 px-2 py-0.5 rounded border border-amber-200 flex-shrink-0">
                <Star size={11} fill="currentColor" />
                Destaque
              </span>
            )}
          </div>

          {/* Nome do Produto limpo (sem código nem tag de dimensão) */}
          <h3 className="text-base sm:text-lg font-display font-black text-termo-dark group-hover:text-termo-yellowDark transition-colors line-clamp-2 mb-3">
            {cleanTitle}
          </h3>

          <div className="space-y-3">
            {/* Bloco: Informações Gerais (Apenas Material e Peso Líquido) */}
            {hasInfo && (
              <div className="bg-gray-50 rounded-lg p-3 border border-gray-100 text-xs space-y-2">
                <div className="text-[10px] font-bold uppercase text-gray-500 tracking-wider mb-1 flex items-center gap-1">
                  <Info size={11} className="text-termo-yellowDark" />
                  <span>Informações Gerais</span>
                </div>
                {meta.material && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Material:</span>
                    <span className="font-bold text-termo-dark">{meta.material}</span>
                  </div>
                )}
                {meta.pesoliquido && (
                  <div className="flex justify-between items-center text-xs">
                    <span className="text-gray-500 font-medium">Peso Líquido:</span>
                    <span className="font-mono font-bold text-termo-dark">{meta.pesoliquido} kg</span>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Rodapé do Card: sempre 'Ver produto' */}
        <div className="mt-2 pt-3 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-500 group-hover:text-termo-dark transition-colors">
          <span className="uppercase tracking-wider text-[11px] font-bold">
            Ver produto
          </span>
          <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform text-termo-yellow" />
        </div>
      </div>
    </div>
  );
};

import React, { useEffect, useMemo } from 'react';
import { Product, ApplicationItem } from '../types';
import { X, Ruler, ArrowUpRight, Layers } from 'lucide-react';
import { DIMENSION_LABELS, DIMENSION_ALIASES, extractProductMeta, getCleanProductName, getFullProductCode } from './DimensionCard';
import { ProductCodeBadges } from './ProductCodeBadges';

interface ApplicationDetailCardProps {
  application: ApplicationItem;
  allProducts?: Product[];
  onClose: () => void;
  onViewInProducts?: (pieceCodes: string[]) => void;
  navigate?: (route: string) => void;
}

// Extrai entradas de dimensão de um produto, filtrando zeros
function extractDimensions(p: Product) {
  const entries: { key: string; label: string; short: string; val: string }[] = [];
  const processed = new Set<string>();

  let parsedSpecs: any = p.specs;
  if (typeof parsedSpecs === 'string') {
    try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
  }

  Object.entries(DIMENSION_LABELS).forEach(([dimKey, meta]) => {
    const val = (p as any)[dimKey] ||
                (p.dimensions && (p.dimensions as any)[dimKey]) ||
                (parsedSpecs && typeof parsedSpecs === 'object' && parsedSpecs[dimKey]);
    const isZero = val === '0' || val === '0.0' || val === '0.000' || parseFloat(String(val)) === 0;
    if (val !== null && val !== undefined && String(val).trim() !== '' && !isZero) {
      processed.add(dimKey);
      entries.push({ key: dimKey, label: meta.label, short: meta.short, val: String(val) });
    }
  });

  const source = p.dimensions || parsedSpecs;
  if (source && typeof source === 'object') {
    Object.entries(source).forEach(([rawKey, rawVal]) => {
      const normalizedKey = rawKey.toLowerCase().replace(/[\s\-_.]/g, '');
      const standardKey = DIMENSION_ALIASES[normalizedKey];
      if (standardKey && !processed.has(standardKey)) {
        const meta = DIMENSION_LABELS[standardKey];
        const isZero = rawVal === '0' || rawVal === '0.0' || rawVal === '0.000' || parseFloat(String(rawVal)) === 0;
        if (meta && rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '' && !isZero) {
          processed.add(standardKey);
          entries.push({ key: standardKey, label: meta.label, short: meta.short, val: String(rawVal) });
        }
      }
    });
  }

  return entries;
}

// Extrai a tag de dimensão específica (STD, 2X, 3X) para componentes dependentes
export function getTagDimensao(code?: string, appCode?: string): string {
  if (!code) return 'STD';
  const match = code.match(/-(STD|[0-9]+X|LUMAG|[\w]+)$/i);
  if (match) return match[1].toUpperCase();
  if (appCode && code.startsWith(appCode)) {
    const rest = code.slice(appCode.length).replace(/^-/, '');
    if (rest === '02' || rest === '2') return '2X';
    if (rest === '03' || rest === '3') return '3X';
    if (rest === '04' || rest === '4') return '4X';
    if (rest) return rest.toUpperCase();
  }
  return 'STD';
}

interface PieceSlot {
  title: string;
  code: string;
  products: Product[];
  standardProduct?: Product;
}

export const ApplicationDetailCard: React.FC<ApplicationDetailCardProps> = ({
  application,
  allProducts = [],
  onClose,
  onViewInProducts
}) => {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = originalOverflow; };
  }, []);

  // Mapeia os slots de peças da aplicação (Motriz, Coletor, Intermediários)
  const pieceSlots = useMemo<PieceSlot[]>(() => {
    const slots: PieceSlot[] = [];
    const usedCodes = new Set<string>();

    const getMatchingProds = (code: string): Product[] => {
      const clean = code.trim().toLowerCase();
      if (!clean) return [];
      const matched = allProducts.filter(p => {
        if (p.codigoligacaoproduto && p.codigoligacaoproduto.trim().toLowerCase() === clean) return true;
        if (p.code) {
          const c = p.code.toLowerCase().trim();
          return c === clean || c.startsWith(`${clean}-`) || c.startsWith(clean);
        }
        return false;
      });

      // Remove duplicatas por id
      const unique = new Map<number, Product>();
      matched.forEach(p => unique.set(p.id, p));
      const prods = Array.from(unique.values());

      // Ordena garantindo que a peça padrão (STD) fique sempre em primeiro lugar
      prods.sort((a, b) => {
        const getRank = (p: Product) => {
          const c = (p.code || '').trim().toUpperCase();
          const { tag, fullCode } = getFullProductCode(p.code, p.name);
          const fullUpper = fullCode.toUpperCase();
          const cleanUpper = clean.toUpperCase();

          // 1. Exatamente code-STD (ex: 1011-STD)
          if (c === `${cleanUpper}-STD` || fullUpper === `${cleanUpper}-STD`) return 1;
          // 2. Tag STD ou código terminado em -STD
          if (tag === 'STD' || c.endsWith('-STD') || fullUpper.endsWith('-STD')) return 2;
          // 3. Código base exato (ex: 1011)
          if (c === cleanUpper) return 3;
          // 4. Sobretamanhos ordenados: 2X, 3X, 4X...
          const matchX = tag.match(/^([0-9]+)X$/);
          if (matchX) return 10 + parseInt(matchX[1], 10);
          return 50;
        };

        return getRank(a) - getRank(b);
      });

      return prods;
    };

    const createSlot = (title: string, rawCode: string): PieceSlot => {
      const code = rawCode.trim();
      const prods = getMatchingProds(code);
      const stdProd = prods.find(p => {
        const { tag, fullCode } = getFullProductCode(p.code, p.name);
        const c = (p.code || '').trim().toUpperCase();
        return tag === 'STD' || c.endsWith('-STD') || fullCode.toUpperCase().endsWith('-STD');
      }) || prods[0];

      return {
        title,
        code,
        products: prods,
        standardProduct: stdProd
      };
    };

    if (application.itemmotriz && application.itemmotriz.trim()) {
      const code = application.itemmotriz.trim();
      usedCodes.add(code);
      slots.push(createSlot('Motriz', code));
    }

    if (application.itemcoletor && application.itemcoletor.trim()) {
      const code = application.itemcoletor.trim();
      usedCodes.add(code);
      slots.push(createSlot('Coletor', code));
    }

    if (application.itemintermediario1 && application.itemintermediario1.trim()) {
      const code = application.itemintermediario1.trim();
      usedCodes.add(code);
      slots.push(createSlot('Intermediário 1', code));
    }

    if (application.itemintermediario2 && application.itemintermediario2.trim()) {
      const code = application.itemintermediario2.trim();
      usedCodes.add(code);
      slots.push(createSlot('Intermediário 2', code));
    }

    if (application.itemintermediario3 && application.itemintermediario3.trim()) {
      const code = application.itemintermediario3.trim();
      usedCodes.add(code);
      slots.push(createSlot('Intermediário 3', code));
    }

    // Se houver mais códigos em pieceCodes que não entraram nos slots nomeados
    if (application.pieceCodes) {
      application.pieceCodes.forEach((code, idx) => {
        if (!usedCodes.has(code)) {
          usedCodes.add(code);
          slots.push(createSlot(`Intermediário ${idx + 1}`, code));
        }
      });
    }

    return slots;
  }, [application, allProducts]);

  const hasAnyProducts = pieceSlots.some(s => s.products.length > 0);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 md:p-10">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/75 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[92vh] flex flex-col overflow-hidden border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">

        {/* Topo do card */}
        <div className="bg-termo-dark text-white px-6 py-5 flex items-center justify-between relative border-b-2 border-termo-yellow">
          <div className="flex flex-col gap-1 pr-4">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-termo-yellow/90">
                Aplicação Automotiva
              </span>
              {application.montadora && (
                <span className="px-2.5 py-0.5 bg-white/10 text-white text-xs font-bold uppercase tracking-wider rounded border border-white/15">
                  {application.montadora}
                </span>
              )}
              {application.marca && (
                <span className="px-2 py-0.5 bg-termo-yellow text-termo-dark text-xs font-mono font-black uppercase rounded shadow-sm">
                  {application.marca}
                </span>
              )}
            </div>
            <h2 className="text-lg sm:text-xl font-display font-black text-white leading-snug">
              {application.aplicacaocatalogo}
            </h2>
          </div>

          <button
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors flex-shrink-0"
          >
            <X size={22} />
          </button>
        </div>

        {/* Body com a lista de componentes */}
        <div className="overflow-y-auto flex-1 p-5 sm:p-6 space-y-6">

          <div className="flex items-center justify-between pb-3 border-b border-gray-200">
            <div className="flex items-center gap-2">
              <Layers size={18} className="text-termo-yellowDark" />
              <h3 className="text-sm font-black text-termo-dark uppercase tracking-wider">
                Peças do Conjunto desta Aplicação
              </h3>
            </div>
            {/* Ajuste solicitado: '3 posições' > x peças */}
            <span className="text-xs font-mono text-gray-500 font-bold">
              {pieceSlots.length} {pieceSlots.length === 1 ? 'peça' : 'peças'}
            </span>
          </div>

          {pieceSlots.length === 0 ? (
            <div className="text-center py-10 bg-gray-50 rounded-xl border border-gray-200 p-6">
              <p className="text-sm text-gray-500">Nenhuma informação técnica de peças cadastrada para esta aplicação.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {pieceSlots.map((slot, sIdx) => {
                const currentProduct = slot.standardProduct || slot.products[0];
                const meta = currentProduct ? extractProductMeta(currentProduct) : null;
                const dims = currentProduct ? extractDimensions(currentProduct) : [];
                const cleanName = currentProduct ? getCleanProductName(currentProduct.name) : 'Peça Sinterizada';

                return (
                  <div key={sIdx} className="bg-gray-50 border border-gray-200 rounded-xl p-4 sm:p-5 space-y-4">
                    {/* Header do item: 'Lado Padrão: x' e botão de redirecionamento para produtos */}
                    <div className="flex items-center justify-between flex-wrap gap-2">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full bg-termo-yellow" />
                        <h4 className="text-xs sm:text-sm font-black uppercase tracking-wider text-termo-dark">
                          Lado {slot.title}
                        </h4>
                      </div>

                      {/* Botão para enviar o usuário para a página de produtos exibindo os produtos deste lado */}
                      {slot.products.length > 0 && onViewInProducts && (
                        <button
                          type="button"
                          onClick={() => onViewInProducts([slot.code])}
                          className="inline-flex items-center gap-1.5 px-3.5 py-1.5 bg-termo-dark hover:bg-termo-yellow text-termo-yellow hover:text-termo-dark text-xs font-bold uppercase tracking-wider rounded-lg transition-all shadow-sm group"
                        >
                          <span>Ver produtos deste lado</span>
                          <ArrowUpRight size={13} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                        </button>
                      )}
                    </div>

                    {slot.products.length === 0 ? (
                      <div className="bg-white rounded-lg p-3 border border-gray-200 text-xs text-gray-500 italic flex items-center justify-between gap-2">
                        <span>Peça cadastrada na aplicação, medidas sob consulta com nossa engenharia.</span>
                        {slot.code && (
                          <ProductCodeBadges code={slot.code} codigoligacaoproduto={slot.code} />
                        )}
                      </div>
                    ) : (
                      <div className="bg-white rounded-lg p-4 border border-gray-200 space-y-3">
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="text-sm font-display font-bold text-termo-dark">
                              {cleanName}
                            </span>
                            <ProductCodeBadges
                              product={currentProduct}
                              code={slot.code}
                              codigoligacaoproduto={slot.code}
                            />
                          </div>

                          <div className="flex items-center gap-3 text-xs">
                            {meta?.material && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400 uppercase text-[10px] font-bold">Material:</span>
                                <span className="font-bold text-termo-dark">{meta.material}</span>
                              </div>
                            )}
                            {meta?.pesoliquido && (
                              <div className="flex items-center gap-1">
                                <span className="text-gray-400 uppercase text-[10px] font-bold">Peso:</span>
                                <span className="font-mono font-bold text-termo-dark">{meta.pesoliquido} kg</span>
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Dimensões básicas da peça */}
                        {dims.length > 0 ? (
                          <div className="pt-2 border-t border-gray-100">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1.5 flex items-center gap-1">
                              <Ruler size={11} className="text-termo-yellowDark" />
                              Dimensões da Peça (mm)
                            </span>
                            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                              {dims.slice(0, 4).map((d, dIdx) => (
                                <div key={dIdx} className="bg-gray-50 p-2 rounded border border-gray-100 flex flex-col">
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
                        ) : (
                          <p className="text-[11px] text-gray-400 italic">Cotas dimensionais sob consulta.</p>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* Botão no rodapé do modal para ver todos os itens da aplicação na aba produtos */}
          {hasAnyProducts && onViewInProducts && (
            <button
              type="button"
              onClick={() => {
                onViewInProducts(application.pieceCodes);
              }}
              className="w-full flex items-center justify-center gap-2 py-3.5 px-4 bg-termo-yellow hover:bg-termo-yellowDark text-termo-dark font-black text-xs uppercase tracking-wider rounded-xl transition-all shadow-md mt-4"
            >
              <ArrowUpRight size={16} />
              <span>Ver todos os itens desta aplicação no catálogo de produtos</span>
            </button>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex justify-end items-center">
          <button
            onClick={onClose}
            className="px-6 py-2.5 text-xs uppercase tracking-wider font-black text-gray-600 hover:text-termo-dark hover:bg-gray-200 rounded-lg transition-colors border border-gray-300"
          >
            Fechar
          </button>
        </div>

      </div>
    </div>
  );
};

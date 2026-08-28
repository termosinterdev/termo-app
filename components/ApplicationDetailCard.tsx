import React, { useEffect, useMemo } from 'react';
import { Product } from '../types';
import { X, Tag, Car, FileText, Ruler, ArrowRight, ArrowUpRight, Settings } from 'lucide-react';
import { GENERIC_DIMENSION_IMG, DIMENSION_LABELS, DIMENSION_ALIASES } from './DimensionCard';

interface ApplicationDetailCardProps {
  product: Product;
  allProducts?: Product[];
  onClose: () => void;
  onSelectProduct?: (product: Product) => void;
  navigate?: (route: string) => void;
}

export const ApplicationDetailCard: React.FC<ApplicationDetailCardProps> = ({ 
  product, 
  allProducts = [], 
  onClose, 
  onSelectProduct, 
  navigate 
}) => {
  // Fechar com a tecla ESC
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  // Bloquear o scroll da página enquanto o modal estiver aberto
  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, []);

  // Extrair todas as medidas e dimensões da peça
  const dimensionEntries = useMemo(() => {
    const entries: { key: string; label: string; short: string; val: string }[] = [];
    const processed = new Set<string>();

    let parsedSpecs: any = product.specs;
    if (typeof parsedSpecs === 'string') {
      try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
    }

    // 1. Campos dimensionais padronizados
    Object.entries(DIMENSION_LABELS).forEach(([dimKey, meta]) => {
      const val = (product as any)[dimKey] || 
                  (product.dimensions && (product.dimensions as any)[dimKey]) || 
                  (parsedSpecs && typeof parsedSpecs === 'object' && parsedSpecs[dimKey]);
      if (val !== null && val !== undefined && String(val).trim() !== '') {
        processed.add(dimKey);
        entries.push({
          key: dimKey,
          label: meta.label,
          short: meta.short,
          val: String(val)
        });
      }
    });

    // 2. Aliases dimensionais conhecidos
    const source = product.dimensions || parsedSpecs;
    if (source && typeof source === 'object') {
      Object.entries(source).forEach(([rawKey, rawVal]) => {
        const normalizedKey = rawKey.toLowerCase().replace(/[\s\-_.]/g, '');
        const standardKey = DIMENSION_ALIASES[normalizedKey];
        if (standardKey && !processed.has(standardKey)) {
          const meta = DIMENSION_LABELS[standardKey];
          if (meta && rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '') {
            processed.add(standardKey);
            entries.push({
              key: standardKey,
              label: meta.label,
              short: meta.short,
              val: String(rawVal)
            });
          }
        }
      });
    }

    return entries;
  }, [product]);

  // Extrair referências de produtos do catálogo vs veículos/aplicações gerais
  const { matchedProducts, otherApplications } = useMemo(() => {
    const matchedMap = new Map<number, Product>();
    const textSources: string[] = [];

    if (product.applied) textSources.push(product.applied);
    
    // Checa em specs por chaves relacionadas a aplicação
    if (product.specs && typeof product.specs === 'object') {
      Object.entries(product.specs).forEach(([k, v]) => {
        if (/aplica|veicul|compativ|uso/i.test(k) && v) {
          textSources.push(String(v));
        }
      });
    }

    const allAppliedText = textSources.join(' \n ');
    const allAppliedTextUpper = allAppliedText.toUpperCase();

    if (allProducts && allProducts.length > 0) {
      allProducts.forEach(p => {
        if (p.id === product.id) return;

        let isMatch = false;

        // 1. Busca flexível por código
        if (p.code && p.code.trim().length >= 3) {
          const rawCode = p.code.trim().toUpperCase();
          const baseCode = rawCode.replace(/^KIT\s+|-STD$/g, '').trim(); // ex: 0253
          
          const codeVariants = [
            rawCode,
            rawCode.replace(/^KIT\s+/, ''), // sem o KIT inicial
            `KIT ${rawCode.replace(/^KIT\s+/, '')}` // garante com KIT
          ];

          isMatch = codeVariants.some(variant => 
            variant.length >= 3 && allAppliedTextUpper.includes(variant)
          );
          
          // Fallback pra base code numérico (ex: "0253") se não achou exato
          if (!isMatch && baseCode.length >= 4) {
            if (allAppliedTextUpper.includes(`KIT ${baseCode}`) || 
                allAppliedTextUpper.includes(`${baseCode}-STD`) || 
                allAppliedTextUpper.includes(`${baseCode} STD`)) {
               isMatch = true;
            }
          }
        }

        // 2. Busca por nome do produto
        if (!isMatch && p.name && p.name.trim().length >= 4) {
          const cleanName = p.name.trim().toUpperCase();
          if (allAppliedTextUpper.includes(cleanName)) {
            isMatch = true;
          }
        }

        if (isMatch) {
          matchedMap.set(p.id, p);
        }
      });
    }

    // Extrair linhas de aplicação geral
    const rawLines = allAppliedText
      .split(/[\n;]/)
      .map(s => s.trim())
      .filter(Boolean);

    const other: string[] = [];
    rawLines.forEach(line => {
      const lineUpper = line.toUpperCase();
      // Se a linha for uma citação explícita do código, e já matchamos ele, ignoramos para não poluir
      const isOnlyMatchedProduct = Array.from(matchedMap.values()).some(p => {
        if (!p.code) return false;
        const codeBase = p.code.toUpperCase().replace(/^KIT\s+/, '');
        return lineUpper.includes(codeBase) && (lineUpper.includes('USO NO') || lineUpper.includes('USO EM') || lineUpper.includes('KIT'));
      });

      if (!isOnlyMatchedProduct && !other.includes(line)) {
        other.push(line);
      }
    });

    return {
      matchedProducts: Array.from(matchedMap.values()),
      otherApplications: other.length > 0 ? other : (product.applied ? [product.applied] : [])
    };
  }, [product, allProducts]);

  // Formatar o campo spec como bloco de texto de observações
  const formatSpecsAsText = () => {
    if (!product.specs) return 'Nenhuma observação técnica registrada.';
    if (typeof product.specs === 'string') return product.specs;
    if (typeof product.specs === 'object') {
      const lines = Object.entries(product.specs).map(([k, v]) => {
        return `• ${k.charAt(0).toUpperCase() + k.slice(1)}: ${typeof v === 'object' ? JSON.stringify(v) : String(v)}`;
      });
      return lines.length > 0 ? lines.join('\n') : 'Nenhuma observação técnica registrada.';
    }
    return String(product.specs);
  };

  const handleOpenProduct = (targetProd: Product) => {
    if (onSelectProduct) {
      onSelectProduct(targetProd);
    } else if (navigate) {
      navigate(`product/${targetProd.id}`);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10">
      {/* Backdrop com blur */}
      <div 
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Modal Card Container */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden border border-gray-100 z-10 animate-in fade-in zoom-in-95 duration-200">
        
        {/* Modal Header */}
        <div className="bg-termo-dark text-white p-6 flex items-start justify-between relative border-b-2 border-termo-yellow">
          <div>
            <div className="flex items-center gap-2 mb-2">
              {product.code ? (
                <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-termo-yellow text-termo-dark text-xs font-mono font-bold rounded shadow-sm">
                  <Tag size={13} />
                  {product.code}
                </span>
              ) : null}
              <span className="px-2.5 py-0.5 bg-white/10 text-gray-300 text-xs font-semibold uppercase tracking-wider rounded">
                {product.category || 'Catálogo de Aplicação'}
              </span>
            </div>
            <h2 className="text-2xl font-display font-bold text-white leading-snug">
              {product.name}
            </h2>
          </div>

          <button 
            onClick={onClose}
            aria-label="Fechar"
            className="p-2 text-gray-400 hover:text-white hover:bg-white/10 rounded-full transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Imagem do Produto */}
          <div className="flex justify-center">
            <div className="rounded-xl overflow-hidden border border-gray-200 bg-gray-100 aspect-square w-48 sm:w-56">
              <img 
                src={(product.images && product.images.length > 0 && product.images[0]) ? product.images[0] : GENERIC_DIMENSION_IMG} 
                alt={product.name} 
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Card de Medidas e Dimensões (Sigla, Nome e Valor) */}
          {dimensionEntries.length > 0 && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5 space-y-3">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-termo-dark uppercase tracking-wider flex items-center gap-2">
                  <Ruler size={18} className="text-termo-yellowDark" />
                  <span>Medidas e Dimensões</span>
                </h3>
                <span className="text-[11px] font-bold text-gray-500 bg-gray-200/80 px-2 py-0.5 rounded-full">
                  {dimensionEntries.length} medidas
                </span>
              </div>
              
              <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-gray-100 text-gray-600 font-bold uppercase tracking-wider border-b border-gray-200">
                      <th className="py-2.5 px-3.5 whitespace-nowrap w-0">Sigla</th>
                      <th className="py-2.5 px-3.5">Dimensão</th>
                      <th className="py-2.5 px-3.5 text-right w-24">Valor</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {dimensionEntries.map((dim, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/40'}>
                        <td className="py-2 px-3.5 font-mono font-bold text-termo-dark whitespace-nowrap w-0">
                          <span className="inline-block px-1.5 py-0.5 bg-gray-100 rounded text-gray-700 whitespace-nowrap">
                            {dim.short}
                          </span>
                        </td>
                        <td className="py-2 px-3.5 text-gray-700 font-medium">
                          {dim.label}
                        </td>
                        <td className="py-2 px-3.5 text-right font-mono font-bold text-termo-dark">
                          {dim.val}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Seção de Aplicação & Veículos Compatíveis */}
          <div className="bg-amber-50/60 border border-amber-200/80 rounded-xl p-5 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-bold text-termo-dark uppercase tracking-wider flex items-center gap-2">
                <Car size={18} className="text-termo-yellowDark" />
                <span>Aplicação & Veículos Compatíveis</span>
              </h3>
              {matchedProducts.length > 0 && (
                <span className="text-[11px] font-bold text-termo-yellowDark bg-amber-100 px-2 py-0.5 rounded-full">
                  {matchedProducts.length} no catálogo
                </span>
              )}
            </div>

            {/* 1. Produtos do Catálogo Vinculados (Exibidos Primeiro) */}
            {matchedProducts.length > 0 && (
              <div className="space-y-2">
                <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                  Peças / Kits disponíveis no catálogo:
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {matchedProducts.map(matched => (
                    <button
                      key={matched.id}
                      type="button"
                      onClick={() => handleOpenProduct(matched)}
                      className="flex items-center gap-3 p-3 bg-white border border-amber-200 hover:border-termo-yellow rounded-xl text-left shadow-sm hover:shadow-md transition-all group cursor-pointer"
                    >
                      <img 
                        src={(matched.images && matched.images.length > 0 && matched.images[0]) ? matched.images[0] : GENERIC_DIMENSION_IMG} 
                        alt={matched.name}
                        className="w-12 h-12 object-contain rounded-lg bg-gray-50 border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        {matched.code && (
                          <span className="inline-block px-1.5 py-0.5 bg-termo-dark text-termo-yellow font-mono text-[10px] font-bold rounded mb-1">
                            {matched.code}
                          </span>
                        )}
                        <h4 className="text-xs font-bold text-termo-dark group-hover:text-termo-yellowDark transition-colors truncate">
                          {matched.name}
                        </h4>
                        <span className="text-[10px] text-gray-500">{matched.category}</span>
                      </div>
                      <ArrowUpRight size={16} className="text-gray-400 group-hover:text-termo-yellowDark transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all flex-shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* 2. Outras Aplicações / Veículos Gerais (Exibidos Abaixo) */}
            {otherApplications.length > 0 && (
              <div className={matchedProducts.length > 0 ? 'border-t border-amber-200/60 pt-4 space-y-3' : 'space-y-3'}>
                {matchedProducts.length > 0 && (
                  <p className="text-xs font-bold text-gray-600 uppercase tracking-wider">
                    Outras aplicações / Veículos compatíveis:
                  </p>
                )}
                <div className="flex flex-col gap-2">
                  {otherApplications.map((appText, i) => {
                    const colonIndex = appText.indexOf(':');
                    const hasColon = colonIndex > -1;
                    const isCodeLike = /kit/i.test(appText) || /[0-9]{4}/.test(appText);

                    return (
                      <div key={i} className="flex items-start gap-3 p-3 bg-white border border-amber-100 rounded-lg shadow-sm">
                        <div className="mt-0.5">
                          {isCodeLike ? (
                            <Settings size={16} className="text-gray-400" />
                          ) : (
                            <Car size={16} className="text-gray-400" />
                          )}
                        </div>
                        <div className="text-sm text-termo-dark font-bold leading-tight flex-1">
                          {hasColon ? (
                            <>
                              <span>{appText.substring(0, colonIndex)}:</span>
                              <span className="font-normal text-gray-600 ml-1">{appText.substring(colonIndex + 1)}</span>
                            </>
                          ) : (
                            <span>{appText}</span>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {matchedProducts.length === 0 && otherApplications.length === 0 && (
              <p className="text-gray-500 text-sm italic">
                Aplicação sob consulta técnica para este componente.
              </p>
            )}
          </div>

          {/* Bloco de Observações e Especificações (Apenas specs do JSON) */}
          {product.specs && (
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-5">
              <h3 className="text-sm font-bold text-termo-dark uppercase tracking-wider mb-2 flex items-center gap-2">
                <FileText size={18} className="text-termo-metal" />
                <span>Observações e Especificações</span>
              </h3>
              <div className="p-3.5 bg-white border border-gray-200 rounded-lg text-xs font-mono text-gray-700 whitespace-pre-wrap leading-relaxed max-h-48 overflow-y-auto">
                {formatSpecsAsText()}
              </div>
            </div>
          )}

          {product.material && (
            <div className="text-xs text-gray-500">
              <strong>Material base:</strong> {product.material}
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-between items-center">
          <button
            onClick={onClose}
            className="px-5 py-2.5 text-sm font-bold text-gray-600 hover:text-gray-900 transition-colors"
          >
            Fechar
          </button>
          
          {navigate && (
            <button
              onClick={() => navigate(`product/${product.id}`)}
              className="inline-flex items-center gap-2 px-6 py-2.5 bg-termo-dark text-termo-yellow hover:bg-termo-yellow hover:text-termo-dark font-bold text-sm rounded-lg shadow transition-all duration-200"
            >
              <span>Ver Página Completa</span>
              <ArrowRight size={16} />
            </button>
          )}
        </div>

      </div>
    </div>
  );
};

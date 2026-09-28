import React, { useEffect, useMemo, useState } from 'react';
import { Product, PageRoute } from '../types';
import { fetchProducts, fetchProductById, mapStrapiProduct } from '../api';
import { ArrowLeft, Ruler, Loader2, Info, CheckCircle2, ChevronRight, Car } from 'lucide-react';
import { DIMENSION_LABELS, DIMENSION_ALIASES, extractProductMeta, getCleanProductName } from '../components/DimensionCard';
import { ProductCodeBadges } from '../components/ProductCodeBadges';

interface ProductDetailProps {
  productId: number | string;
  navigate: (route: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, navigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.scrollTo(0, 0);

    const loadData = async () => {
      setLoading(true);
      try {
        // 1. Tenta carregar o produto específico diretamente (resposta rápida ~50ms)
        const directProd = await fetchProductById(productId);
        if (directProd) {
          const mapped = mapStrapiProduct(directProd);
          setProduct(mapped);
          setLoading(false);
        }

        // 2. Busca lista para os produtos relacionados
        const strapiProducts = await fetchProducts();
        const mappedProducts: Product[] = strapiProducts.map(mapStrapiProduct);
        setAllProducts(mappedProducts);

        if (!directProd) {
          const foundProduct = mappedProducts.find(p => 
            p.id === Number(productId) || 
            String(p.id) === String(productId) || 
            p.documentId === String(productId) ||
            p.code?.toLowerCase() === String(productId).toLowerCase()
          );
          setProduct(foundProduct || null);
          setLoading(false);
        }

        const activeId = directProd?.id || Number(productId);
        const activeMat = directProd?.material || '';
        let related = mappedProducts.filter(p => p.id !== activeId);
        if (activeMat) {
          const sameMat = related.filter(p => (p.material || '').toLowerCase().trim() === activeMat.toLowerCase().trim());
          if (sameMat.length >= 4) {
            related = sameMat;
          }
        }
        setRelatedProducts(related.slice(0, 4));
      } catch (err) {
        console.error('Erro ao carregar produto:', err);
        setLoading(false);
      }
    };

    loadData();
  }, [productId]);

  // Extração de dimensões
  const dimensionEntries = useMemo(() => {
    if (!product) return [];
    const entries: { key: string; label: string; short: string; val: string }[] = [];
    const processed = new Set<string>();

    let parsedSpecs: any = product.specs;
    if (typeof parsedSpecs === 'string') {
      try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
    }

    Object.entries(DIMENSION_LABELS).forEach(([dimKey, meta]) => {
      const val = (product as any)[dimKey] ||
                  (product.dimensions && (product.dimensions as any)[dimKey]) ||
                  (parsedSpecs && typeof parsedSpecs === 'object' && parsedSpecs[dimKey]);
      const isZero = val === '0' || val === '0.0' || val === '0.000' || parseFloat(String(val)) === 0;
      if (val !== null && val !== undefined && String(val).trim() !== '' && !isZero) {
        processed.add(dimKey);
        entries.push({ key: dimKey, label: meta.label, short: meta.short, val: String(val) });
      }
    });

    const source = product.dimensions || parsedSpecs;
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
  }, [product]);

  // Metadados gerais e lista de aplicações
  const productMeta = useMemo(() => {
    if (!product) return null;
    return extractProductMeta(product);
  }, [product]);

  // Aplicações estruturadas (se houver array aplicacoes em specs)
  const structuredAplicacoes = useMemo(() => {
    if (!product) return [];
    let parsedSpecs: any = product.specs;
    if (typeof parsedSpecs === 'string') {
      try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
    }
    if (parsedSpecs && Array.isArray(parsedSpecs.aplicacoes)) {
      return parsedSpecs.aplicacoes.filter((a: any) => a && (a.descricao || a.montadora || a.marca));
    }
    return [];
  }, [product]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-termo-yellow animate-spin mb-4" />
        <h2 className="text-xl font-black text-gray-500 uppercase tracking-widest">Carregando produto...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-[#0f0f0f] pt-32 pb-20 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-black text-white mb-4 uppercase tracking-wider">Produto não encontrado</h2>
        <button
          onClick={() => navigate(PageRoute.CATALOG)}
          className="text-termo-yellow hover:text-white font-bold uppercase tracking-widest transition-colors"
        >
          Voltar ao Catálogo
        </button>
      </div>
    );
  }

  const cleanTitle = getCleanProductName(product.name);

  return (
    <div className="min-h-screen pt-28 pb-20 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 max-w-6xl">

        {/* Breadcrumb + Voltar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-2 text-xs sm:text-sm text-gray-500 font-medium">
            <button onClick={() => navigate(PageRoute.HOME)} className="hover:text-termo-yellow transition-colors">Início</button>
            <span className="text-gray-300">/</span>
            <button onClick={() => navigate(PageRoute.CATALOG)} className="hover:text-termo-yellow transition-colors">Catálogo</button>
            <span className="text-gray-300">/</span>
            <span className="text-gray-700 font-bold truncate max-w-xs">{cleanTitle}</span>
          </div>

          <button
            onClick={() => navigate(PageRoute.CATALOG)}
            className="inline-flex items-center gap-2 text-gray-600 font-bold hover:text-termo-dark transition-colors text-xs uppercase tracking-wider"
          >
            <ArrowLeft size={16} />
            <span>Voltar ao Catálogo</span>
          </button>
        </div>

        {/* Card Principal: Layout Limpo e Técnico (Sem Imagem) */}
        <div className="bg-white rounded-2xl shadow-sm border border-gray-200 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1.5 bg-termo-yellow" />

          {/* Cabeçalho do Produto */}
          <div className="p-6 sm:p-10 border-b border-gray-100 bg-gradient-to-b from-gray-50/50 to-white">
            {/* Preço (se houver) */}
            {product.price && product.price !== '0' && product.price !== '0,1' && (
              <div className="flex justify-end mb-2">
                <div className="text-right">
                  <span className="text-xs text-gray-400 block font-mono">Preço sob consulta</span>
                  <span className="text-2xl font-black text-termo-dark font-mono">{product.price}</span>
                </div>
              </div>
            )}

            {/* Apenas o Título Limpo */}
            <h1 className="text-2xl sm:text-4xl font-display font-black text-termo-dark tracking-tight">
              {cleanTitle}
            </h1>

            <ProductCodeBadges product={product} size="md" className="mt-3" />
          </div>

          {/* Grid de Informações Técnicas e Medidas */}
          <div className="p-6 sm:p-10 space-y-10">

            {/* 1. Especificações do Produto */}
            <div className="space-y-6">
              <div className="flex items-center gap-2 pb-2 border-b border-gray-200">
                <Info size={18} className="text-termo-yellowDark" />
                <h2 className="text-base font-black text-termo-dark uppercase tracking-wider">
                  Especificações do Produto
                </h2>
              </div>

              {/* Informações Básicas: Material, Peso Líquido */}
              {(productMeta?.material || productMeta?.pesoliquido) && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {productMeta?.material && (
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Material</span>
                      <span className="text-sm sm:text-base font-black text-termo-dark">{productMeta.material}</span>
                    </div>
                  )}
                  {productMeta?.pesoliquido && (
                    <div className="bg-gray-50 border border-gray-200 p-4 rounded-xl">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block mb-1">Peso Líquido</span>
                      <span className="text-sm sm:text-base font-mono font-bold text-termo-dark">{productMeta.pesoliquido} kg</span>
                    </div>
                  )}
                </div>
              )}

              {/* Montadoras e Marca / Sistema em caixinhas bonitinhas */}
              {((productMeta?.montadorasList && productMeta.montadorasList.length > 0) || 
                (productMeta?.marcasList && productMeta.marcasList.length > 0)) && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {productMeta?.montadorasList && productMeta.montadorasList.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-xl space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Montadoras Compatíveis ({productMeta.montadorasList.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {productMeta.montadorasList.map((montadora, idx) => (
                          <span
                            key={idx}
                            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-bold text-gray-800 uppercase tracking-wider shadow-sm cursor-default select-none"
                          >
                            {montadora}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {productMeta?.marcasList && productMeta.marcasList.length > 0 && (
                    <div className="bg-gray-50 border border-gray-200 p-4 sm:p-5 rounded-xl space-y-3">
                      <span className="text-[10px] font-bold uppercase tracking-wider text-gray-400 block">
                        Marca / Sistema ({productMeta.marcasList.length})
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {productMeta.marcasList.map((marca, idx) => (
                          <span
                            key={idx}
                            className="px-3.5 py-2 bg-white border border-gray-200 rounded-xl text-xs font-mono font-bold text-termo-dark shadow-sm cursor-default select-none"
                          >
                            {marca}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 2. Medidas e Cotas Dimensionais */}
            {dimensionEntries.length > 0 && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <Ruler size={18} className="text-termo-yellowDark" />
                  <h2 className="text-base font-black text-termo-dark uppercase tracking-wider">
                    Medidas e Dimensões Técnicas
                  </h2>
                </div>

                <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                  <table className="w-full text-left text-sm border-collapse">
                    <thead>
                      <tr className="bg-termo-dark text-white text-[11px] font-black uppercase tracking-wider border-b border-gray-200">
                        <th className="py-3 px-5 whitespace-nowrap w-24">Sigla</th>
                        <th className="py-3 px-5">Dimensão</th>
                        <th className="py-3 px-5 text-right w-36">Medida (mm)</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {dimensionEntries.map((dim, idx) => (
                        <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                          <td className="py-3 px-5 font-mono font-bold text-termo-dark whitespace-nowrap">
                            <span className="inline-block px-2.5 py-1 bg-gray-100 rounded text-gray-800 text-xs font-mono font-bold">
                              {dim.short}
                            </span>
                          </td>
                          <td className="py-3 px-5 text-gray-700 font-medium">{dim.label}</td>
                          <td className="py-3 px-5 text-right font-mono font-black text-termo-dark text-base">{dim.val}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* 3. Aplicações e Veículos Compatíveis */}
            {(structuredAplicacoes.length > 0 || (productMeta && productMeta.aplicacoes.length > 0)) && (
              <div>
                <div className="flex items-center gap-2 mb-4 pb-2 border-b border-gray-200">
                  <Car size={18} className="text-termo-yellowDark" />
                  <h2 className="text-base font-black text-termo-dark uppercase tracking-wider">
                    Aplicações e Veículos Compatíveis
                  </h2>
                </div>

                {structuredAplicacoes.length > 0 ? (
                  <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
                    <table className="w-full text-left text-xs sm:text-sm border-collapse">
                      <thead>
                        <tr className="bg-amber-100/70 text-termo-dark text-[11px] font-black uppercase tracking-wider border-b border-amber-200">
                          <th className="py-3 px-4 w-40">Montadora</th>
                          <th className="py-3 px-4 w-40">Marca</th>
                          <th className="py-3 px-4">Veículo / Descrição da Aplicação</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-100">
                        {structuredAplicacoes.map((app: any, idx: number) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-amber-50/30'}>
                            <td className="py-3 px-4 font-bold text-termo-dark">{app.montadora || '—'}</td>
                            <td className="py-3 px-4 font-semibold text-gray-600">{app.marca || '—'}</td>
                            <td className="py-3 px-4 text-gray-800 leading-relaxed font-medium">{app.descricao || '—'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {productMeta?.aplicacoes.map((app, idx) => (
                      <div key={idx} className="p-3.5 bg-gray-50 border border-gray-200 rounded-lg flex items-start gap-2.5">
                        <CheckCircle2 size={16} className="text-termo-yellowDark mt-0.5 flex-shrink-0" />
                        <span className="text-xs text-gray-800 font-semibold leading-relaxed">{app}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

        {/* Outros Produtos Sinterizados */}
        {relatedProducts.length > 0 && (
          <div className="mt-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-6 h-0.5 bg-termo-yellow" />
              <h2 className="text-xl font-display font-black text-termo-dark uppercase tracking-wider">
                Outros Produtos Sinterizados
              </h2>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(relProduct => {
                const relCleanName = getCleanProductName(relProduct.name);
                const relMeta = extractProductMeta(relProduct);
                return (
                  <div
                    key={relProduct.id}
                    onClick={() => navigate(`product/${relProduct.id}`)}
                    className="cursor-pointer group bg-white border border-gray-200 hover:border-termo-yellow p-4 rounded-xl shadow-sm hover:shadow-md transition-all flex flex-col justify-between"
                  >
                    <div>
                      <h4 className="font-bold text-termo-dark text-sm line-clamp-2 group-hover:text-termo-yellowDark transition-colors mb-2">
                        {relCleanName}
                      </h4>
                      <ProductCodeBadges product={relProduct} className="mb-2" />
                      <div className="space-y-1 text-[11px] text-gray-500">
                        {relMeta.material && (
                          <p>
                            Material: <strong className="text-termo-dark">{relMeta.material}</strong>
                          </p>
                        )}
                        {relMeta.pesoliquido && (
                          <p>
                            Peso: <strong className="font-mono text-termo-dark">{relMeta.pesoliquido} kg</strong>
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="mt-4 pt-2 border-t border-gray-100 flex items-center justify-between text-xs font-bold text-gray-400 group-hover:text-termo-dark">
                      <span>Ver produto</span>
                      <ChevronRight size={14} className="text-termo-yellow group-hover:translate-x-1 transition-transform" />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

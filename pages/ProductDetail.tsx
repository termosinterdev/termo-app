import React, { useEffect, useMemo, useState } from 'react';
import { Product, PageRoute } from '../types';
import { fetchProducts, mapStrapiProduct } from '../api';
import { ArrowLeft, Ruler, ChevronLeft, ChevronRight, Loader2, Tag, FileText } from 'lucide-react';
import { DIMENSION_LABELS, DIMENSION_ALIASES } from '../components/DimensionCard';

interface ProductDetailProps {
  productId: number;
  navigate: (route: string) => void;
}

export const ProductDetail: React.FC<ProductDetailProps> = ({ productId, navigate }) => {
  const [product, setProduct] = useState<Product | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  useEffect(() => {
    window.scrollTo(0, 0);
    
    const loadData = async () => {
      setLoading(true);
      const strapiProducts = await fetchProducts();
      
      const mappedProducts: Product[] = strapiProducts.map(mapStrapiProduct);
      
      const foundProduct = mappedProducts.find(p => p.id === productId);
      setProduct(foundProduct || null);
      
      if (foundProduct) {
        const cat = (foundProduct.category || '').toLowerCase().trim();
        const related = mappedProducts
          .filter(p => p.id !== foundProduct.id && (p.category || '').toLowerCase().trim() === cat)
          .slice(0, 4);
        setRelatedProducts(related);
      }
      setLoading(false);
    };

    loadData();
  }, [productId]);

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

  const images = product.images;

  const nextImage = () => {
    setCurrentImageIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentImageIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="min-h-screen pt-24 pb-20 bg-gray-50">
      <div className="container mx-auto px-6">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-6 font-medium">
          <button onClick={() => navigate(PageRoute.HOME)} className="hover:text-termo-yellow transition-colors">Início</button>
          <span className="text-gray-300">/</span>
          <button onClick={() => navigate(PageRoute.CATALOG)} className="hover:text-termo-yellow transition-colors">Catálogo</button>
          <span className="text-gray-300">/</span>
          <span className="text-gray-700 font-semibold truncate max-w-xs">{product.name}</span>
        </div>

        {/* Back button */}
        <button
          onClick={() => navigate(PageRoute.CATALOG)}
          className="flex items-center gap-2 text-gray-500 font-bold hover:text-termo-yellow mb-8 transition-colors group text-sm"
        >
          <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para o Catálogo
        </button>

        {/* Main Card */}
        <div className="bg-white rounded-xl shadow-md overflow-hidden border border-gray-200 relative">
          {/* Top yellow accent */}
          <div className="absolute top-0 left-0 w-full h-1 bg-termo-yellow" />

          <div className="grid grid-cols-1 lg:grid-cols-2">

            {/* Image Panel */}
            <div className="p-8 bg-gray-50 flex flex-col justify-center items-center relative select-none border-r border-gray-100">
              {/* Category badge */}
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-2 bg-termo-dark text-termo-yellow text-sm font-black uppercase tracking-wider shadow">
                  {product.category}
                </span>
              </div>

              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[460px] flex items-center justify-center group z-10">
                <img
                  src={images[currentImageIndex]}
                  alt={product.name}
                  className="w-full h-full object-contain transition-transform duration-500"
                />

                <button
                  onClick={prevImage}
                  className="absolute left-0 p-3 bg-white hover:bg-termo-yellow hover:text-termo-dark text-gray-500 transition-all shadow-sm opacity-0 group-hover:opacity-100 border border-gray-200 rounded-full"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={22} />
                </button>
                <button
                  onClick={nextImage}
                  className="absolute right-0 p-3 bg-white hover:bg-termo-yellow hover:text-termo-dark text-gray-500 transition-all shadow-sm opacity-0 group-hover:opacity-100 border border-gray-200 rounded-full"
                  aria-label="Next image"
                >
                  <ChevronRight size={22} />
                </button>
              </div>

              <div className="flex gap-2 mt-6 z-10">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setCurrentImageIndex(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${idx === currentImageIndex ? 'w-8 bg-termo-yellow' : 'w-2 bg-gray-300 hover:bg-gray-400'}`}
                    aria-label={`Go to image ${idx + 1}`}
                  />
                ))}
              </div>
            </div>

            {/* Info Panel */}
            <div className="p-8 lg:p-12 flex flex-col gap-5 overflow-y-auto">
              {/* Code + Name */}
              <div>
                {product.code && (
                  <div className="flex items-center gap-1.5 text-xs font-mono text-termo-yellowDark font-bold mb-2 uppercase tracking-widest">
                    <Tag size={13} />
                    <span>{product.code}</span>
                  </div>
                )}
                <h1 className="text-3xl lg:text-4xl font-display font-black text-termo-dark leading-tight">
                  {product.name}
                </h1>
                {product.category && (
                  <span className="inline-block mt-2 px-3 py-1 bg-gray-100 text-gray-600 text-xs font-bold uppercase tracking-wider rounded border border-gray-200">
                    {product.category}
                  </span>
                )}
              </div>

              <div className="w-10 h-0.5 bg-termo-yellow" />

              {/* Price — only if exists */}
              {product.price && (() => {
                const match = product.price.match(/^(.*?)((?:R\$\s*)?[\d.,]+)(.*)$/i);
                const prefix = match ? match[1] : '';
                const priceVal = match ? match[2] : product.price;
                const suffix = match ? match[3].trim() : '';
                return (
                  <div className="flex items-baseline gap-2 flex-wrap">
                    {prefix.trim() && <span className="text-lg font-bold text-gray-500">{prefix.trim()}</span>}
                    <span className="text-3xl font-black text-termo-yellowDark">{priceVal}</span>
                    {suffix && <span className="text-sm text-gray-500">{suffix}</span>}
                  </div>
                );
              })()}

              {/* Description */}
              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed border-l-2 border-termo-yellow/50 pl-4 bg-gray-50 py-3 pr-4 rounded-r">{product.description}</p>
              )}

              {/* Dimensions Section */}
              {(() => {
                const entries: { label: string; short: string; val: string }[] = [];
                const processed = new Set<string>();

                let parsedSpecs: any = product.specs;
                if (typeof parsedSpecs === 'string') {
                  try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = {}; }
                }

                Object.entries(DIMENSION_LABELS).forEach(([dimKey, meta]) => {
                  const val = (product as any)[dimKey] ||
                    (product.dimensions && (product.dimensions as any)[dimKey]) ||
                    (parsedSpecs && typeof parsedSpecs === 'object' && parsedSpecs[dimKey]);
                  if (val !== null && val !== undefined && String(val).trim() !== '') {
                    processed.add(dimKey);
                    entries.push({ label: meta.label, short: meta.short, val: String(val) });
                  }
                });

                const source = product.dimensions || parsedSpecs;
                if (source && typeof source === 'object') {
                  Object.entries(source).forEach(([rawKey, rawVal]) => {
                    const normalizedKey = rawKey.toLowerCase().replace(/[\s\-_.]/g, '');
                    const standardKey = DIMENSION_ALIASES[normalizedKey];
                    if (standardKey && !processed.has(standardKey)) {
                      const meta = DIMENSION_LABELS[standardKey];
                      if (meta && rawVal !== null && rawVal !== undefined && String(rawVal).trim() !== '') {
                        processed.add(standardKey);
                        entries.push({ label: meta.label, short: meta.short, val: String(rawVal) });
                      }
                    }
                  });
                }

                if (entries.length === 0) return null;
                return (
                  <div>
                    <h3 className="text-sm font-black text-termo-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                      <Ruler size={15} className="text-termo-yellow" />
                      Medidas e Dimensões
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm border-collapse">
                        <thead>
                          <tr className="bg-termo-dark text-white text-[10px] font-black uppercase tracking-wider">
                            <th className="px-4 py-3 text-left whitespace-nowrap w-0">Sigla</th>
                            <th className="px-4 py-3 text-left">Dimensão</th>
                            <th className="px-4 py-3 text-right whitespace-nowrap w-0">Valor</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                          {entries.map((dim, idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-2.5 whitespace-nowrap w-0">
                                <span className="inline-block px-2 py-0.5 bg-termo-dark/5 border border-gray-200 font-mono text-xs text-termo-dark font-bold whitespace-nowrap">
                                  {dim.short}
                                </span>
                              </td>
                              <td className="px-4 py-2.5 text-gray-600">{dim.label}</td>
                              <td className="px-4 py-2.5 text-right font-mono font-black text-termo-dark whitespace-nowrap">{dim.val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}

              {/* Specs Section */}
              {(() => {
                const DIMENSION_KEYS = new Set(Object.keys(DIMENSION_LABELS));

                let parsedSpecs: any = product.specs;
                if (typeof parsedSpecs === 'string') {
                  try { parsedSpecs = JSON.parse(parsedSpecs); } catch { parsedSpecs = null; }
                }

                const specEntries: [string, string][] = [];

                if (product.material) {
                  specEntries.push(['Material', product.material]);
                }

                if (parsedSpecs && typeof parsedSpecs === 'object') {
                  Object.entries(parsedSpecs).forEach(([k, v]) => {
                    const normalized = k.toLowerCase().replace(/[\s\-_.]/g, '');
                    if (!DIMENSION_KEYS.has(normalized) && !DIMENSION_ALIASES[normalized]) {
                      const label = k.charAt(0).toUpperCase() + k.slice(1).replace(/_/g, ' ');
                      specEntries.push([label, typeof v === 'object' ? JSON.stringify(v) : String(v)]);
                    }
                  });
                }

                if (specEntries.length === 0) return null;
                return (
                  <div>
                    <h3 className="text-sm font-black text-termo-dark uppercase tracking-wider mb-3 flex items-center gap-2">
                      <FileText size={15} className="text-termo-yellow" />
                      Especificações Técnicas
                    </h3>
                    <div className="border border-gray-200 rounded-lg overflow-hidden">
                      <table className="w-full text-sm">
                        <tbody className="divide-y divide-gray-100">
                          {specEntries.map(([key, val], idx) => (
                            <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                              <td className="px-4 py-2.5 font-bold text-gray-500 text-xs w-1/3 whitespace-nowrap uppercase tracking-wider">{key}</td>
                              <td className="px-4 py-2.5 text-termo-dark font-semibold">{val}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div className="mt-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="w-6 h-0.5 bg-termo-yellow" />
            <h2 className="text-xl font-display font-black text-termo-dark uppercase tracking-wider">
              Produtos Relacionados
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {relatedProducts.map(relProduct => (
              <div
                key={relProduct.id}
                className="cursor-pointer group bg-white border border-gray-200 overflow-hidden relative transition-all duration-300 hover:border-termo-yellow hover:shadow-md shadow-sm"
                onClick={() => navigate(`product/${relProduct.id}`)}
              >
                <div className="absolute top-0 left-0 w-full h-1 bg-termo-yellow" />

                <div className="h-40 bg-gray-100 overflow-hidden relative">
                  <img
                    src={relProduct.images[0]}
                    alt={relProduct.name}
                    className="w-full h-full object-cover transition-all duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-termo-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="absolute top-3 left-3">
                    <span className="px-2 py-1 bg-termo-dark text-termo-yellow text-[9px] font-mono font-black uppercase tracking-widest">
                      {relProduct.category}
                    </span>
                  </div>
                </div>

                <div className="p-5">
                  <h4 className="font-black text-termo-dark text-base truncate mb-1 group-hover:text-termo-yellow transition-colors">{relProduct.name}</h4>
                  <p className="text-xs text-gray-500 font-mono uppercase tracking-wider mb-2">{relProduct.category}</p>
                  <p className="text-termo-yellowDark font-black text-sm">{relProduct.price}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

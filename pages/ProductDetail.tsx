import React, { useEffect, useState } from 'react';
import { Product, PageRoute } from '../types';
import { fetchProducts } from '../api';
import { ArrowLeft, ShieldCheck, Ruler, ChevronLeft, ChevronRight, Loader2 } from 'lucide-react';

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
      
      const mappedProducts: Product[] = strapiProducts.map(sp => ({
        id: sp.id,
        name: sp.name,
        category: (sp.category?.name as any) || 'Outros',
        description: sp.applied || 'Produto com alta durabilidade e precisão.',
        material: sp.specs?.material || 'Diversos',
        price: sp.price || '',
        specs: sp.specs || {},
        code: sp.code,
        images: sp.pictures && sp.pictures.length > 0 
          ? sp.pictures.map(p => `http://localhost:1337${p.url}`) 
          : ['https://photos.fife.usercontent.google.com/pw/AP1GczPJr5V3GrUkjs2zfKjIEAmbu6unLpZmmiZG20QJik8Puo9p7yJWds2osw=w578-h586-s-no-gm?authuser=0']
      }));
      
      const foundProduct = mappedProducts.find(p => p.id === productId);
      setProduct(foundProduct || null);
      
      if (foundProduct) {
        setRelatedProducts(
          mappedProducts.filter(p => p.category === foundProduct.category && p.id !== foundProduct.id).slice(0, 3)
        );
      }
      setLoading(false);
    };

    loadData();
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <Loader2 size={48} className="text-termo-yellow animate-spin mb-4" />
        <h2 className="text-xl font-bold text-gray-700">Carregando produto...</h2>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-20 flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Produto não encontrado</h2>
        <button 
          onClick={() => navigate(PageRoute.CATALOG)}
          className="text-termo-yellow hover:underline font-bold"
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
        
        <div className="flex items-center gap-2 text-sm text-gray-500 mb-8 font-medium">
          <button onClick={() => navigate(PageRoute.HOME)} className="hover:text-termo-yellow">Início</button>
          <span>/</span>
          <button onClick={() => navigate(PageRoute.CATALOG)} className="hover:text-termo-yellow">Catálogo</button>
          <span>/</span>
          <span className="text-termo-dark">{product.name}</span>
        </div>

        <button 
          onClick={() => navigate(PageRoute.CATALOG)}
          className="flex items-center gap-2 text-termo-dark font-bold hover:text-termo-yellow mb-8 transition-colors group"
        >
          <ArrowLeft size={20} className="group-hover:-translate-x-1 transition-transform" />
          Voltar para Lista
        </button>

        <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-gray-100">
          <div className="grid grid-cols-1 lg:grid-cols-2">
            
            <div className="p-8 bg-gray-100 flex flex-col justify-center items-center relative select-none">
              <div className="absolute top-6 left-6 z-10">
                <span className="px-4 py-2 bg-termo-yellow text-termo-dark text-sm font-bold uppercase tracking-wider rounded shadow-md">
                  {product.category}
                </span>
              </div>
              
              <div className="relative w-full h-[300px] md:h-[400px] lg:h-[500px] flex items-center justify-center group">
                <img 
                  src={images[currentImageIndex]} 
                  alt={product.name} 
                  className="w-full h-full object-contain mix-blend-multiply transition-transform duration-500"
                />
                
                <button 
                  onClick={prevImage}
                  className="absolute left-0 p-3 bg-white/50 hover:bg-termo-yellow hover:text-termo-dark text-gray-600 rounded-full backdrop-blur-sm transition-all shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110"
                  aria-label="Previous image"
                >
                  <ChevronLeft size={24} />
                </button>
                <button 
                  onClick={nextImage}
                  className="absolute right-0 p-3 bg-white/50 hover:bg-termo-yellow hover:text-termo-dark text-gray-600 rounded-full backdrop-blur-sm transition-all shadow-sm opacity-0 group-hover:opacity-100 hover:scale-110"
                  aria-label="Next image"
                >
                  <ChevronRight size={24} />
                </button>
              </div>

              <div className="flex gap-3 mt-8">
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

            <div className="p-8 lg:p-12 flex flex-col">
              {product.code && (
                <div className="mb-2 text-gray-400 text-sm font-mono uppercase tracking-widest">Código: {product.code}</div>
              )}
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-termo-dark mb-4 leading-tight">
                {product.name}
              </h1>
              
              {product.price && (() => {
                const match = product.price.match(/^(.*?)((?:R\$\s*)?[\d.,]+)(.*)$/i);
                const prefix = match ? match[1] : '';
                const priceVal = match ? match[2] : product.price;
                const suffix = match ? match[3] : '';
                return (
                  <div className="mb-6 flex items-baseline flex-wrap">
                    {prefix.trim() && <span className="text-xl font-bold text-termo-dark mr-2">{prefix.trim()}</span>}
                    <span className="text-3xl font-bold text-termo-yellowDark">{priceVal}</span>
                    <span className="text-sm text-gray-500 ml-2">
                      {suffix.trim() ? suffix.trim() : ''} <span className="opacity-75">(Pedido mín. sob consulta)</span>
                    </span>
                  </div>
                );
              })()}
              
              <div className="prose prose-lg text-gray-600 mb-8">
                <p>{product.description}</p>
                <p className="text-sm">
                  Fabricado em <strong className="text-termo-dark">{product.material}</strong>, este componente oferece durabilidade excepcional para aplicações industriais exigentes. Ideal para montadoras e sistemistas.
                </p>
              </div>

              <div className="mb-10">
                <h3 className="text-lg font-bold text-termo-dark mb-4 flex items-center gap-2">
                  <Ruler size={20} className="text-termo-yellow" /> Especificações e detalhes
                </h3>
                <div className="border border-gray-200 rounded-lg overflow-hidden">
                  <table className="w-full text-sm">
                    <tbody className="divide-y divide-gray-200">
                      {product.specs && Object.keys(product.specs).length > 0 ? (
                        Object.entries(product.specs).map(([key, value], idx) => (
                          <tr key={idx} className={idx % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                            <td className="px-4 py-3 font-medium text-gray-600 capitalize">{key}</td>
                            <td className="px-4 py-3 text-gray-800">{String(value)}</td>
                          </tr>
                        ))
                      ) : (
                        <tr className="bg-gray-50">
                          <td className="px-4 py-3 font-medium text-gray-600">Material Base</td>
                          <td className="px-4 py-3 font-bold text-termo-dark">{product.material}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="mt-auto">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded border border-gray-100 w-fit">
                  <ShieldCheck className="text-termo-yellow" size={24} />
                  <span className="text-sm font-medium text-gray-700">Certificado ISO 9001</span>
                </div>
              </div>

            </div>
          </div>
        </div>

        <div className="mt-20">
          <h2 className="text-2xl font-display font-bold text-termo-dark mb-8 uppercase border-l-4 border-termo-yellow pl-4">
            Produtos Relacionados
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
             {relatedProducts.map(relProduct => (
                  <div key={relProduct.id} className="cursor-pointer group" onClick={() => navigate(`product/${relProduct.id}`)}>
                    <div className="bg-white p-4 rounded shadow hover:shadow-lg transition-all border border-gray-100 h-full flex flex-col">
                      <div className="h-40 bg-gray-100 mb-4 overflow-hidden rounded relative">
                        <img src={relProduct.images[0]} alt={relProduct.name} className="w-full h-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500" />
                        <div className="absolute inset-0 bg-termo-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
                      </div>
                      <h4 className="font-bold text-termo-dark text-lg truncate mb-1">{relProduct.name}</h4>
                      <p className="text-xs text-gray-500 mb-2">{relProduct.category}</p>
                      <p className="text-termo-yellowDark font-bold text-sm">{relProduct.price}</p>
                    </div>
                  </div>
             ))}
          </div>
        </div>

      </div>
    </div>
  );
};

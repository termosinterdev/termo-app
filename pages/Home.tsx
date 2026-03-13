import React, { useState, useEffect } from 'react';
import { SERVICES } from '../constants';
import { PageRoute, Product } from '../types';
import { fetchProducts } from '../api';
import { ProductCard } from '../components/ProductCard';
import { Settings, Wrench, Microscope, Flame, ArrowRight, CheckCircle2, Loader2 } from 'lucide-react';

interface HomeProps {
  navigate: (route: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Settings: <Settings size={40} />,
  Wrench: <Wrench size={40} />,
  Microscope: <Microscope size={40} />,
  Flame: <Flame size={40} />,
};

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      const strapiProducts = await fetchProducts();
      
      const mappedProducts: Product[] = strapiProducts.slice(0, 3).map(sp => ({
        id: sp.id,
        name: sp.name,
        category: (sp.category?.name as any) || 'Outros',
        description: sp.applied || 'Produto com alta durabilidade e precisão.',
        material: sp.specs?.material || 'Diversos',
        price: sp.price || '',
        specs: sp.specs || {},
        images: sp.pictures && sp.pictures.length > 0 
          ? sp.pictures.map(p => `http://localhost:1337${p.url}`) 
          : ['https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800']
      }));
      
      setFeaturedProducts(mappedProducts);
      setLoadingProducts(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[90vh] flex items-center bg-termo-dark overflow-hidden">
        <div className="absolute inset-0 z-0 opacity-40">
           <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')]"></div>
           <img 
            src="https://images.unsplash.com/photo-1565457223363-d343c1b48ab6?q=80&w=2070&auto=format&fit=crop" 
            alt="Industrial Machinery" 
            className="w-full h-full object-cover"
           />
           <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-3xl">
            <h2 className="text-termo-yellow font-bold uppercase tracking-[0.2em] mb-4 animate-fade-in">Desde 1995</h2>
            <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-8">
              EXCELÊNCIA EM <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">
                METALURGIA DO PÓ
              </span>
            </h1>
            <p className="text-xl text-gray-300 mb-10 leading-relaxed max-w-2xl">
              Soluções avançadas em sinterização para a indústria automotiva e de eletrodomésticos. 
              Precisão micrométrica e durabilidade incomparável.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => navigate(PageRoute.CATALOG)}
                className="px-8 py-4 bg-termo-yellow text-termo-dark font-bold text-lg uppercase tracking-wider rounded hover:bg-termo-yellowDark transition-colors flex items-center justify-center gap-2"
              >
                Ver Catálogo <ArrowRight size={20} />
              </button>
              <button 
                onClick={() => document.getElementById('about')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 border border-white text-white font-bold text-lg uppercase tracking-wider rounded hover:bg-white hover:text-termo-dark transition-colors"
              >
                Nossa Empresa
              </button>
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-termo-yellow/20 rounded-full z-0"></div>
              <img 
                src="https://images.unsplash.com/photo-1567789884554-0b844b597180?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D" 
                alt="Factory Floor" 
                className="rounded-lg shadow-2xl relative z-10"
              />
              <div className="absolute -bottom-6 -right-6 bg-termo-dark p-8 rounded shadow-xl z-20 hidden md:block">
                <p className="text-termo-yellow text-4xl font-display font-bold">+25 Anos</p>
                <p className="text-gray-400 text-sm uppercase tracking-wider">De Inovação</p>
              </div>
            </div>
            <div>
              <h3 className="text-termo-yellow font-bold uppercase tracking-wider mb-2">Sobre a Termosinter</h3>
              <h2 className="text-4xl font-display font-bold text-termo-dark mb-6">Tecnologia Sinterizada para Alta Performance</h2>
              <p className="text-gray-600 leading-relaxed mb-6">
                A Termosinter é líder nacional na fabricação de peças sinterizadas. Utilizamos pós metálicos de alta pureza e processos de compactação de última geração para criar componentes complexos com desperdício mínimo de material e máxima eficiência energética.
              </p>
              <ul className="space-y-4 mb-8">
                {['Certificação ISO 9001', 'Laboratório de Metrologia Próprio', 'Capacidade de produção em massa'].map((item) => (
                  <li key={item} className="flex items-center gap-3 text-termo-dark font-medium">
                    <CheckCircle2 className="text-termo-yellow" size={20} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-termo-silver">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-termo-dark mb-4">NOSSOS PROCESSOS</h2>
            <div className="w-24 h-1 bg-termo-yellow mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {SERVICES.map((service) => (
              <div key={service.id} className="bg-white p-8 rounded-lg shadow-sm hover:shadow-xl hover:-translate-y-2 transition-all duration-300 border-t-4 border-transparent hover:border-termo-yellow group">
                <div className="text-termo-metal group-hover:text-termo-yellow transition-colors mb-6">
                  {iconMap[service.iconName]}
                </div>
                <h3 className="text-xl font-bold text-termo-dark mb-3">{service.title}</h3>
                <p className="text-gray-600 text-sm leading-relaxed">{service.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-termo-dark">DESTAQUES</h2>
              <p className="text-gray-500 mt-2">Soluções mais procuradas pela indústria</p>
            </div>
            <button 
              onClick={() => navigate(PageRoute.CATALOG)}
              className="hidden md:flex items-center gap-2 text-termo-dark font-bold hover:text-termo-yellowDark transition-colors"
            >
              Ver Tudo <ArrowRight size={20} />
            </button>
          </div>

          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-10">
              <Loader2 size={40} className="text-termo-yellow animate-spin mb-4" />
              <p className="text-gray-500 font-medium">Carregando destaques...</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredProducts.map((product) => (
                <ProductCard key={product.id} product={product} navigate={navigate} />
              ))}
            </div>
          )}

          <button 
              onClick={() => navigate(PageRoute.CATALOG)}
              className="md:hidden mt-8 w-full py-4 border border-termo-dark text-termo-dark font-bold uppercase rounded hover:bg-termo-dark hover:text-white transition-colors"
            >
              Ver Catálogo Completo
          </button>
        </div>
      </section>
    </div>
  );
};
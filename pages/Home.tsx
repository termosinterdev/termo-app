import React, { useState, useEffect } from 'react';
import { SERVICES } from '../constants';
import { PageRoute, Product } from '../types';
import { fetchProducts } from '../api';
import { ProductCard } from '../components/ProductCard';
import { Settings, Wrench, Microscope, Flame, ArrowRight, CheckCircle2, Loader2, ChevronLeft, ChevronRight } from 'lucide-react';

interface HomeProps {
  navigate: (route: string) => void;
}

const iconMap: Record<string, React.ReactNode> = {
  Settings: <Settings size={40} />,
  Wrench: <Wrench size={40} />,
  Microscope: <Microscope size={40} />,
  Flame: <Flame size={40} />,
};

const carouselSlides = [
  {
    id: 1,
    image: "public/imagens/9A5EEFD4-90E2-4544-93CF-80A129C8222C.jpg",
    subtitle: "QUALIDADE, ATENDIMENTO E PONTUALIDADE",
    title: <>A FILOSOFIA <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">DA TERMOSINTER</span></>,
    description: "Situada em Guaratinguetá (SP), somos uma empresa brasileira focada em metalurgia do pó. Com tecnologia própria e unidade fabril de 100.000m², entregamos pós metálicos e peças sinterizadas de altíssima qualidade."
  },
  {
    id: 2,
    image: "public/imagens/37F54947-3373-4B7B-ADF7-831CEC688358.jpg",
    subtitle: "Tecnologia",
    title: <>SOLUÇÕES <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">INOVADORAS</span></>,
    description: "Com ampla experiência e acesso a tecnologias avançadas, focamos na evolução constante. Desenvolvemos as melhores soluções buscando ótimo custo-benefício, concepção inteligente de produtos e suporte técnico de excelência."
  },
  {
    id: 3,
    image: "public/imagens/2A57BAFB-E969-47D5-8195-378E0A193D84.jpg",
    subtitle: "Meio Ambiente",
    title: <>COMPROMISSO <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">AMBIENTAL</span></>,
    description: "A sustentabilidade é prioridade em nossas decisões. Garantimos rigoroso controle de particulados e reuso de água industrial, operando sempre em total conformidade com as regulamentações ambientais vigentes."
  }
];

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
    return () => clearInterval(timer);
  }, [currentSlide]);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);

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
          ? sp.pictures.map(p => `https://termosinter.ind.br/api/admin/auth/login${p.url}`) 
          : ['https://drive.google.com/drive/folders/1TeeS80653W6aOXndSROgSiciAHpTlexV?usp=sharing']
      }));
      
      setFeaturedProducts(mappedProducts);
      setLoadingProducts(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen">
      <section className="relative h-[100vh] flex items-center bg-termo-dark overflow-hidden group">
        {carouselSlides.map((slide, index) => (
          <div 
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] mix-blend-overlay opacity-40 z-10 pointer-events-none"></div>
            {/* Parallax effect background image */}
            <div 
              className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-[10000ms] ease-linear"
              style={{ 
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-transparent z-10"></div>
            
            <div className="container mx-auto px-6 relative z-20 h-full flex items-center">
              <div 
                className={`max-w-3xl backdrop-blur-md bg-white/5 border border-white/10 p-8 md:p-12 rounded-2xl shadow-2xl transition-all duration-1000 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <h2 className="text-termo-yellow font-bold uppercase tracking-[0.2em] mb-4">{slide.subtitle}</h2>
                <h1 className="text-5xl md:text-7xl font-display font-bold text-white leading-tight mb-8 drop-shadow-lg">
                  {slide.title}
                </h1>
                <p className="text-xl text-gray-200 mb-10 leading-relaxed max-w-2xl drop-shadow-md">
                  {slide.description}
                </p>
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex gap-3 z-30">
          {carouselSlides.map((_, index) => (
            <button 
              key={index}
              onClick={() => setCurrentSlide(index)}
              className={`h-2 rounded-full transition-all duration-500 ${index === currentSlide ? 'bg-termo-yellow w-12' : 'bg-white/40 hover:bg-white/80 w-3'}`}
              aria-label={`Ir para o slide ${index + 1}`}
            />
          ))}
        </div>

        <button 
          onClick={prevSlide}
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-30 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={40} strokeWidth={1.5} />
        </button>
        <button 
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-30 p-3 text-white/50 hover:text-white hover:bg-white/10 rounded-full backdrop-blur-sm transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={40} strokeWidth={1.5} />
        </button>
      </section>

      <section id="about" className="py-20 bg-white">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
            <div className="relative">
              <div className="absolute -top-4 -left-4 w-24 h-24 bg-termo-yellow/20 rounded-full z-0"></div>
              <img 
                src="../imagens/termoerosao.jpg" 
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

              <button className="hidden md:flex items-center gap-2 text-termo-dark font-bold hover:text-termo-yellowDark transition-colors">
                Assista nosso vídeo <ArrowRight size={20} />
              </button>
              <hr></hr>
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
              <p className="text-gray-500 mt-2">Nossos principais produtos</p>
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
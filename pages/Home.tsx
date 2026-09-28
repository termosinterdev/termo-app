import React, { useState, useEffect, useRef } from 'react';
import { SERVICES } from '../constants';
import { PageRoute, Product } from '../types';
import { fetchFavoriteProducts, mapStrapiProduct } from '../api';
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
    image: "/imagens/9A5EEFD4-90E2-4544-93CF-80A129C8222C.jpg",
    subtitle: "QUALIDADE, ATENDIMENTO E PONTUALIDADE",
    title: <>A FILOSOFIA <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">DA TERMOSINTER</span></>,
    description: "Situada em Guaratinguetá (SP), somos uma empresa brasileira focada em metalurgia do pó. Com tecnologia própria e unidade fabril de 100.000m², entregamos pós metálicos e peças sinterizadas de altíssima qualidade."
  },
  {
    id: 2,
    image: "/imagens/37F54947-3373-4B7B-ADF7-831CEC688358.jpg",
    subtitle: "Tecnologia",
    title: <>SOLUÇÕES <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">INOVADORAS</span></>,
    description: "Com ampla experiência e acesso a tecnologias avançadas, focamos na evolução constante. Desenvolvemos as melhores soluções buscando ótimo custo-benefício, concepção inteligente de produtos e suporte técnico de excelência."
  },
  {
    id: 3,
    image: "/imagens/2A57BAFB-E969-47D5-8195-378E0A193D84.jpg",
    subtitle: "Meio Ambiente",
    title: <>COMPROMISSO <br /><span className="text-transparent bg-clip-text bg-gradient-to-r from-gray-100 to-gray-500">AMBIENTAL</span></>,
    description: "A sustentabilidade é prioridade em nossas decisões. Garantimos rigoroso controle de particulados e reuso de água industrial, operando sempre em total conformidade com as regulamentações ambientais vigentes."
  }
];

export const Home: React.FC<HomeProps> = ({ navigate }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loadingProducts, setLoadingProducts] = useState(true);
  const [currentSlide, setCurrentSlide] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    }, 6000);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % carouselSlides.length);
    startTimer();
  };
  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + carouselSlides.length) % carouselSlides.length);
    startTimer();
  };

  useEffect(() => {
    const loadProducts = async () => {
      setLoadingProducts(true);
      const strapiProducts = await fetchFavoriteProducts();
      
      const mappedProducts: Product[] = strapiProducts.map(mapStrapiProduct);
      
      setFeaturedProducts(mappedProducts);
      setLoadingProducts(false);
    };

    loadProducts();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f]">
      {/* ===== HERO CAROUSEL ===== */}
      <section className="relative h-[100vh] flex items-center bg-termo-dark overflow-hidden group">
        {/* Diagonal cut bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 bg-[#0f0f0f] z-30"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />

        {carouselSlides.map((slide, index) => (
          <div
            key={slide.id}
            className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'}`}
          >
            {/* Grid texture */}
            <div
              className="absolute inset-0 opacity-20 z-10 pointer-events-none mix-blend-overlay"
              style={{
                backgroundImage: 'linear-gradient(rgba(252,211,77,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(252,211,77,0.4) 1px, transparent 1px)',
                backgroundSize: '60px 60px'
              }}
            />
            {/* Parallax effect background image */}
            <div
              className="absolute inset-0 bg-cover bg-center bg-fixed transition-transform duration-[10000ms] ease-linear"
              style={{
                backgroundImage: `url(${slide.image})`,
                transform: index === currentSlide ? 'scale(1.05)' : 'scale(1)'
              }}
            ></div>
            <div className="absolute inset-0 bg-gradient-to-r from-[#0f0f0f] via-black/80 to-transparent z-10"></div>

            <div className="container mx-auto px-6 relative z-20 h-full flex items-center">
              <div
                className={`max-w-3xl transition-all duration-1000 delay-300 ${
                  index === currentSlide ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'
                }`}
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-0.5 bg-termo-yellow" />
                  <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs">
                    {slide.subtitle}
                  </span>
                </div>

                <h1 className="text-6xl md:text-8xl font-display font-black text-white leading-none mb-8 tracking-tight uppercase">
                  {slide.title}
                </h1>

                <p className="text-xl text-gray-400 max-w-2xl leading-relaxed border-l-2 border-termo-yellow pl-6 font-medium">
                  {slide.description}
                </p>

                {/* CTAs — visíveis apenas no slide ativo */}
                {index === currentSlide && (
                  <div className="flex flex-col sm:flex-row gap-4 mt-10">
                    <button
                      onClick={() => navigate(PageRoute.CATALOG)}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-termo-yellow text-termo-dark font-black uppercase tracking-widest hover:bg-white transition-colors group text-sm"
                      aria-label="Ver catálogo de produtos"
                    >
                      Ver Catálogo
                      <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button
                      onClick={() => navigate(PageRoute.ABOUT)}
                      className="inline-flex items-center gap-3 px-8 py-4 bg-transparent border border-white/30 text-white font-bold uppercase tracking-widest hover:bg-white/10 hover:border-white/60 transition-colors text-sm"
                      aria-label="Conheça a empresa"
                    >
                      Conheça a Empresa
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Carousel Controls */}
        <div className="absolute bottom-16 left-1/2 -translate-x-1/2 flex gap-3 z-40">
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
          className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 z-40 p-3 text-white/30 hover:text-termo-yellow hover:bg-white/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronLeft size={48} strokeWidth={1.5} />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 z-40 p-3 text-white/30 hover:text-termo-yellow hover:bg-white/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
        >
          <ChevronRight size={48} strokeWidth={1.5} />
        </button>
      </section>

      {/* ===== SOBRE A TERMOSINTER ===== */}
      <section id="about" className="py-24 bg-[#141414] relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Right accent bar */}
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-termo-yellow/30" />

        <div className="container mx-auto px-6 max-w-7xl relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-20 items-center">
            {/* Image Side */}
            <div className="relative">
              <div className="relative overflow-hidden group">
                {/* Yellow border accent corners */}
                <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-termo-yellow z-20" />
                <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-termo-yellow z-20" />

                <img
                  src="/imagens/termoerosao.jpg"
                  alt="Factory Floor"
                  className="w-full h-auto object-cover grayscale opacity-80 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700"
                />
                <div className="absolute inset-0 bg-termo-yellow/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>

              <div className="absolute -bottom-8 -right-8 bg-[#0f0f0f] border border-white/10 p-8 shadow-2xl z-30 hidden md:block group">
                {/* Hover fill effect */}
                <div className="absolute inset-0 bg-termo-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                <div className="relative z-10 text-center">
                  <p className="text-white group-hover:text-termo-dark text-5xl font-display font-black transition-colors duration-300">
                    +25 <span className="text-termo-yellow group-hover:text-termo-dark">Anos</span>
                  </p>
                  <p className="text-gray-500 group-hover:text-termo-dark font-bold uppercase tracking-widest text-xs mt-2 transition-colors duration-300">
                    De Inovação
                  </p>
                </div>
              </div>
            </div>

            {/* Text Side */}
            <div>
              <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs">
                Sobre a Termosinter
              </span>
              <h2 className="text-5xl md:text-6xl font-display font-black text-white mt-4 mb-6 leading-none">
                TECNOLOGIA <span className="text-white/20">SINTERIZADA</span><br />
                PARA ALTA PERFORMANCE
              </h2>

              <div className="w-12 h-1 bg-termo-yellow mb-8" />

              <p className="text-gray-400 leading-relaxed text-lg mb-8">
                A Termosinter é líder nacional na fabricação de peças sinterizadas. Utilizamos pós metálicos de alta pureza e processos de compactação de última geração para criar componentes complexos com desperdício mínimo de material e máxima eficiência energética.
              </p>

              <div className="h-px bg-white/10 w-full mb-8" />

              <ul className="space-y-4">
                {['Certificação ISO 9001', 'Laboratório de Metrologia Próprio', 'Capacidade de produção em massa'].map((item) => (
                  <li key={item} className="flex items-center gap-4 text-gray-300 font-medium">
                    <CheckCircle2 className="text-termo-yellow flex-shrink-0" size={24} />
                    {item}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ===== NOSSOS PROCESSOS ===== */}
      <section className="py-32 bg-[#141414] scroll-reveal relative overflow-hidden">
        {/* Top diagonal */}
        <div className="container mx-auto px-6 relative z-10 pt-10">
          <div className="text-center mb-20">
            <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs">Visão Geral</span>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white mt-3 mb-6">
              NOSSOS <span className="text-white/20">PROCESSOS</span>
            </h2>
            <div className="w-16 h-1 bg-termo-yellow mx-auto"></div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {SERVICES.map((service, index) => (
              <div 
                key={service.id} 
                className="bg-[#1a1a1a] border border-white/10 p-10 relative overflow-hidden group transition-all duration-500"
              >
                {/* Hover fill */}
                <div className="absolute inset-0 bg-termo-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                
                <div className="relative z-10">
                  <div className="text-termo-yellow group-hover:text-termo-dark transition-colors duration-300 mb-8">
                    {iconMap[service.iconName]}
                  </div>
                  <h3 className="text-2xl font-display font-black text-white group-hover:text-termo-dark transition-colors duration-300 mb-4">
                    {service.title}
                  </h3>
                  <div className="w-8 h-0.5 bg-white/20 group-hover:bg-termo-dark/30 mb-4 transition-colors duration-300" />
                  <p className="text-gray-400 group-hover:text-termo-dark/80 text-sm leading-relaxed transition-colors duration-300">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== DESTAQUES ===== */}
      <section className="py-32 bg-[#0f0f0f] scroll-reveal relative overflow-hidden">
        {/* Grid texture overlay */}
        <div 
          className="absolute inset-0 opacity-5 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-16 gap-8">
            <div>
              <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs">Portfólio</span>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white mt-3">
                DESTAQUES
              </h2>
              <p className="text-gray-500 font-medium text-lg mt-2">
                Nossos principais produtos
              </p>
            </div>
            
            <button 
              onClick={() => navigate(PageRoute.CATALOG)}
              className="hidden md:flex items-center gap-3 px-8 py-4 bg-termo-yellow text-termo-dark font-black uppercase tracking-widest hover:bg-white transition-colors group"
            >
              Ver Tudo 
              <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
            </button>
          </div>

          {loadingProducts ? (
            <div className="flex flex-col items-center justify-center py-20 border border-white/5 bg-white/5">
              <Loader2 size={48} className="text-termo-yellow animate-spin mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-wider text-sm">Carregando destaques...</p>
            </div>
          ) : featuredProducts.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 border border-white/10 bg-white/5 text-center px-6">
              <p className="text-gray-400 text-lg font-medium mb-6">
                Explore nosso catálogo completo de peças sinterizadas.
              </p>
              <button
                onClick={() => navigate(PageRoute.CATALOG)}
                className="inline-flex items-center gap-3 px-8 py-4 bg-termo-yellow text-termo-dark font-black uppercase tracking-widest hover:bg-white transition-colors group text-sm"
              >
                Acessar o Catálogo
                <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
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
              className="md:hidden mt-10 w-full py-5 bg-white/5 border border-white/10 text-white font-bold uppercase tracking-widest rounded-none hover:bg-termo-yellow hover:text-termo-dark hover:border-termo-yellow transition-colors"
            >
              Ver Catálogo Completo
          </button>
        </div>
      </section>
    </div>
  );
};
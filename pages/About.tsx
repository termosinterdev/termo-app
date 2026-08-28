import React, { useEffect, useState } from 'react';
import { Award, Leaf, Zap, Cog, Factory as FactoryIcon, Droplets, ChevronRight, ArrowRight } from 'lucide-react';
import { PageRoute } from '../types';

interface AboutProps {
  navigate: (route: string) => void;
}

const timelineData = [
  {
    year: '1953',
    title: 'A Fundação',
    description: 'Início das atividades focadas em soluções inovadoras para a indústria brasileira, marcando o nascimento de uma tradição em metalurgia.',
    image: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&q=80&w=800'
  },
  {
    year: '1995',
    title: 'Evolução Tecnológica',
    description: 'Adoção de novas tecnologias de sinterização importadas da Europa, elevando a qualidade dos produtos ao nível internacional.',
    image: '/imagens/termoerosao.jpg'
  },
  {
    year: '2010',
    title: 'Expansão da Fábrica',
    description: 'Inauguração da nossa estrutura de 100.000m² em Guaratinguetá (SP), consolidando nossa capacidade de produção em larga escala.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
  },
  {
    year: 'Hoje',
    title: 'Liderança de Mercado',
    description: 'Referência nacional em peças sinterizadas de alta complexidade e compromisso inabalável com a sustentabilidade.',
    image: '/imagens/termo1.jpg'
  }
];

const processesData = [
  {
    id: 'atomizacao',
    title: 'Atomização',
    icon: <Droplets size={28} />,
    description: 'Processo fundamental onde o metal fundido é desintegrado em finas partículas de pó. Nossa planta versátil garante pós metálicos de altíssima pureza.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800',
    number: '01'
  },
  {
    id: 'compactacao',
    title: 'Compactação',
    icon: <FactoryIcon size={28} />,
    description: 'O pó metálico é prensado em matrizes de alta precisão com toneladas de pressão. Isso define a forma e a densidade exata da peça estrutural.',
    image: '/imagens/termo2.jpg',
    number: '02'
  },
  {
    id: 'sinterizacao',
    title: 'Sinterização',
    icon: <Zap size={28} />,
    description: 'As peças compactadas são aquecidas em fornos de atmosfera controlada a temperaturas logo abaixo do ponto de fusão, soldando as partículas e garantindo resistência mecânica.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800',
    number: '03'
  },
  {
    id: 'acabamento',
    title: 'Acabamento e Usinagem',
    icon: <Cog size={28} />,
    description: 'Ajustes finos, impregnação de óleo (para mancais autolubrificantes) e usinagem de precisão para garantir tolerâncias micrométricas.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800',
    number: '04'
  }
];

export const About: React.FC<AboutProps> = ({ navigate }) => {
  const [activeProcess, setActiveProcess] = useState(processesData[0].id);

  useEffect(() => {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('opacity-100', 'translate-y-0');
          entry.target.classList.remove('opacity-0', 'translate-y-10');
        }
      });
    }, { threshold: 0.1 });

    document.querySelectorAll('.scroll-animate').forEach((el) => {
      el.classList.add('opacity-0', 'translate-y-10', 'transition-all', 'duration-1000');
      observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return (
    <div className="flex flex-col min-h-screen bg-[#0f0f0f] text-white">

      {/* ===== HERO — INDUSTRIAL BLAST ===== */}
      <section className="relative min-h-screen flex items-end bg-termo-dark overflow-hidden">
        {/* Background Image */}
        <div className="absolute inset-0">
          <img
            src="/imagens/termo1.jpg"
            alt="Fábrica"
            className="w-full h-full object-cover opacity-30"
          />
          {/* Diagonal vignette */}
          <div className="absolute inset-0 bg-gradient-to-br from-[#0f0f0f] via-termo-dark/80 to-transparent" />
          {/* Grid overlay */}
          <div
            className="absolute inset-0 opacity-10"
            style={{
              backgroundImage: 'linear-gradient(rgba(252,211,77,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(252,211,77,0.4) 1px, transparent 1px)',
              backgroundSize: '60px 60px'
            }}
          />
        </div>

        {/* Yellow diagonal accent bar */}
        <div className="absolute top-0 right-0 w-2 h-full bg-termo-yellow" />
        <div className="absolute bottom-0 left-0 w-full h-2 bg-termo-yellow" />

        <div className="container mx-auto px-6 relative z-10 pb-24 pt-40">
          {/* Label */}
          <div className="flex items-center gap-3 mb-8">
            <div className="w-10 h-0.5 bg-termo-yellow" />
            <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs">A Nossa Essência</span>
          </div>

          <h1 className="text-6xl md:text-9xl font-display font-black text-white leading-none mb-6 tracking-tight">
            HISTÓRIA,<br />
            TRADIÇÃO<br />
            <span className="text-termo-yellow">&amp; TECNOLOGIA</span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 max-w-2xl leading-relaxed border-l-2 border-termo-yellow pl-6">
            Desde 1953, moldando o futuro da indústria brasileira através da excelência em metalurgia do pó.
          </p>
        </div>

        {/* Diagonal cut bottom */}
        <div
          className="absolute bottom-0 left-0 w-full h-24 bg-[#0f0f0f]"
          style={{ clipPath: 'polygon(0 100%, 100% 0, 100% 100%)' }}
        />
      </section>

      {/* ===== STATS — STEEL PLATE STYLE ===== */}
      <section className="bg-[#0f0f0f] py-0 relative z-10">
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 border border-white/10">
            {[
              { value: '100k', unit: 'm²', label: 'Área Total' },
              { value: '15k', unit: 'm²', label: 'Área Construída' },
              { value: '+70', unit: 'anos', label: 'de Mercado' },
              { value: 'ISO', unit: '9001', label: 'Certificação' },
            ].map((stat, i) => (
              <div
                key={i}
                className="relative p-10 border-r border-b border-white/10 last:border-r-0 group overflow-hidden"
              >
                {/* Hover fill */}
                <div className="absolute inset-0 bg-termo-yellow scale-y-0 group-hover:scale-y-100 transition-transform duration-500 origin-bottom" />
                <div className="relative z-10">
                  <div className="text-4xl md:text-5xl font-display font-black text-white group-hover:text-termo-dark transition-colors duration-300">
                    {stat.value}
                    <span className="text-termo-yellow group-hover:text-termo-dark text-2xl md:text-3xl ml-1">{stat.unit}</span>
                  </div>
                  <p className="text-gray-500 group-hover:text-termo-dark font-bold uppercase tracking-widest text-xs mt-2 transition-colors duration-300">
                    {stat.label}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TIMELINE — INDUSTRIAL RAIL ===== */}
      <section className="py-32 bg-[#0f0f0f] relative overflow-hidden">
        {/* Background grid */}
        <div
          className="absolute inset-0 opacity-5"
          style={{
            backgroundImage: 'linear-gradient(white 1px, transparent 1px), linear-gradient(90deg, white 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />

        <div className="container mx-auto px-6 relative z-10">
          {/* Section header */}
          <div className="mb-24 scroll-animate">
            <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs">Linha do Tempo</span>
            <h2 className="text-5xl md:text-7xl font-display font-black text-white mt-3 leading-none">
              NOSSA<br /><span className="text-white/20">TRAJETÓRIA</span>
            </h2>
          </div>

          <div className="relative">
            {/* Rail line */}
            <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-px bg-gradient-to-b from-termo-yellow via-termo-yellow/50 to-transparent hidden md:block" />

            {timelineData.map((item, index) => (
              <div
                key={item.year}
                className={`flex flex-col md:flex-row items-start md:items-center mb-20 scroll-animate gap-8 ${index % 2 !== 0 ? 'md:flex-row-reverse' : ''}`}
              >
                {/* Text side */}
                <div className={`flex-1 ${index % 2 !== 0 ? 'md:text-right md:pl-16' : 'md:pr-16'}`}>
                  <div className="inline-block">
                    <span className="text-[7rem] md:text-[10rem] font-display font-black leading-none text-white/5 block -mb-8 select-none">
                      {item.year}
                    </span>
                    <h3 className="text-3xl md:text-4xl font-display font-black text-white relative z-10 mb-4">
                      {item.title}
                    </h3>
                    <div className={`w-12 h-1 bg-termo-yellow mb-4 ${index % 2 !== 0 ? 'md:ml-auto' : ''}`} />
                    <p className="text-gray-400 leading-relaxed text-base max-w-sm">
                      {item.description}
                    </p>
                  </div>
                </div>

                {/* Central diamond */}
                <div className="hidden md:flex items-center justify-center w-5 h-5 bg-termo-yellow rotate-45 flex-shrink-0 shadow-[0_0_20px_rgba(252,211,77,0.6)] z-10" />

                {/* Image side */}
                <div className="flex-1">
                  <div className="relative overflow-hidden group">
                    {/* Yellow border accent */}
                    <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-termo-yellow z-20" />
                    <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-termo-yellow z-20" />
                    <img
                      src={item.image}
                      alt={item.title}
                      className="w-full h-64 md:h-80 object-cover grayscale group-hover:grayscale-0 transition-all duration-700 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-termo-yellow/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                    {/* Year stamp */}
                    <div className="absolute top-4 right-4 bg-termo-dark/80 backdrop-blur-sm px-3 py-1 border border-termo-yellow/40">
                      <span className="text-termo-yellow font-mono font-black text-sm">{item.year}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== PROCESS — FACTORY FLOOR ===== */}
      <section className="bg-[#141414] relative overflow-hidden">
        {/* Top diagonal */}
        <div
          className="absolute top-0 left-0 w-full h-20 bg-[#0f0f0f]"
          style={{ clipPath: 'polygon(0 0, 100% 0, 0 100%)' }}
        />

        <div className="container mx-auto px-6 pt-32 pb-24 relative z-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-20 scroll-animate gap-8">
            <div>
              <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs">Tecnologia Aplicada</span>
              <h2 className="text-5xl md:text-7xl font-display font-black text-white mt-3 leading-none">
                PROCESSOS<br /><span className="text-termo-yellow">FABRIS</span>
              </h2>
            </div>
            <p className="text-gray-500 max-w-sm leading-relaxed border-l border-termo-yellow/30 pl-4">
              Contamos com uma estrutura de ponta para garantir o menor custo, a melhor concepção de produto e testes rigorosos de qualidade.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-0 scroll-animate">
            {/* Sidebar navigation */}
            <div className="w-full lg:w-72 flex flex-col border border-white/10 flex-shrink-0">
              {processesData.map((process, i) => (
                <button
                  key={process.id}
                  onClick={() => setActiveProcess(process.id)}
                  className={`flex items-center gap-4 px-6 py-5 text-left transition-all duration-200 border-b border-white/10 last:border-b-0 group relative overflow-hidden flex-1 ${
                    activeProcess === process.id
                      ? 'bg-termo-yellow text-termo-dark'
                      : 'text-gray-400 hover:text-white hover:bg-white/5'
                  }`}
                >
                  <span className={`font-mono text-xs font-black ${activeProcess === process.id ? 'text-termo-dark/50' : 'text-white/20'}`}>
                    {process.number}
                  </span>
                  <div className={activeProcess === process.id ? 'text-termo-dark' : 'text-termo-yellow'}>
                    {process.icon}
                  </div>
                  <span className="font-bold text-base flex-1">{process.title}</span>
                  <ChevronRight
                    size={16}
                    className={`transition-transform ${activeProcess === process.id ? 'translate-x-1 text-termo-dark' : 'group-hover:translate-x-1'}`}
                  />
                </button>
              ))}
            </div>

            {/* Display panel — h-auto so it stretches to match sidebar */}
            <div className="flex-1 relative border border-l-0 border-white/10 overflow-hidden" style={{ minHeight: '320px' }}>
              {processesData.map((process) => (
                <div
                  key={process.id}
                  className={`absolute inset-0 transition-all duration-500 ${
                    activeProcess === process.id
                      ? 'opacity-100 translate-x-0 pointer-events-auto'
                      : 'opacity-0 translate-x-8 pointer-events-none'
                  }`}
                >
                  <img
                    src={process.image}
                    alt={process.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#141414] via-black/50 to-transparent" />

                  {/* Content overlay */}
                  <div className="absolute bottom-0 left-0 w-full p-8 md:p-10">
                    <div className="flex items-start gap-4 mb-3">
                      <span className="font-mono text-termo-yellow/40 text-4xl font-black leading-none">{process.number}</span>
                      <div>
                        <div className="w-10 h-0.5 bg-termo-yellow mb-2" />
                        <h4 className="text-3xl font-display font-black text-white">{process.title}</h4>
                      </div>
                    </div>
                    <p className="text-gray-300 leading-relaxed max-w-lg">
                      {process.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ===== ENVIRONMENTAL — DARK INDUSTRIAL ===== */}
      <section className="py-24 bg-[#0f0f0f] relative overflow-hidden scroll-animate">
        {/* Background accent */}
        <div className="absolute right-0 top-0 bottom-0 w-1/3 bg-gradient-to-l from-termo-yellow/5 to-transparent" />
        <div className="absolute right-0 top-0 bottom-0 w-1 bg-termo-yellow/30" />

        <div className="container mx-auto px-6 max-w-6xl relative z-10">
          <div className="grid md:grid-cols-2 gap-16 items-center">
            {/* Left: Big icon + label */}
            <div className="flex flex-col items-start">
              <div className="w-24 h-24 bg-termo-yellow flex items-center justify-center mb-8">
                <Leaf size={48} className="text-termo-dark" />
              </div>
              <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-xs mb-4">Responsabilidade</span>
              <h2 className="text-5xl md:text-6xl font-display font-black text-white leading-none">
                COMPROMISSO<br />
                <span className="text-white/20">AMBIENTAL</span>
              </h2>
            </div>

            {/* Right: Text */}
            <div>
              <div className="w-12 h-1 bg-termo-yellow mb-8" />
              <p className="text-gray-300 leading-relaxed text-lg">
                A sustentabilidade é uma prioridade na condução de nossas decisões técnicas. Garantimos o controle rigoroso de materiais particulados e o{' '}
                <strong className="text-white">reuso de água industrial</strong>, atendendo plenamente todas as regulamentações em vigor.
              </p>
              <p className="text-gray-500 leading-relaxed mt-4">
                Cuidar do meio ambiente faz parte da nossa essência de produzir de forma inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== CTA — HIGH VOLTAGE ===== */}
      <section className="relative bg-termo-yellow py-32 overflow-hidden">
        {/* Grid texture */}
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'linear-gradient(rgba(0,0,0,0.8) 1px, transparent 1px), linear-gradient(90deg, rgba(0,0,0,0.8) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        {/* Diagonal accents */}
        <div className="absolute top-0 right-0 w-64 h-full bg-termo-dark/20 skew-x-6 origin-top-right" />
        <div className="absolute top-0 right-16 w-8 h-full bg-termo-dark/10 skew-x-6 origin-top-right" />

        <div className="container mx-auto px-6 relative z-10 text-center scroll-animate">
          <span className="font-mono font-black uppercase tracking-[0.4em] text-termo-dark/50 text-xs">Próximo passo</span>
          <h2 className="text-5xl md:text-7xl font-display font-black text-termo-dark mt-4 mb-6 leading-none">
            PRONTO PARA<br />NOSSAS SOLUÇÕES?
          </h2>
          <p className="text-termo-dark/70 text-xl mb-12 max-w-2xl mx-auto font-medium">
            Descubra por que a Termosinter é líder no mercado de peças sinterizadas de alta complexidade.
          </p>
          <button
            onClick={() => navigate(PageRoute.CATALOG)}
            className="inline-flex items-center gap-3 px-12 py-5 bg-termo-dark text-white font-black text-base uppercase tracking-widest hover:bg-black transition-all duration-300 shadow-2xl group"
          >
            <span>Acessar o Catálogo</span>
            <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
          </button>
        </div>
      </section>

    </div>
  );
};

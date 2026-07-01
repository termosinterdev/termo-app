import React, { useEffect, useState } from 'react';
import { Award, Leaf, Zap, Cog, Factory as FactoryIcon, Droplets } from 'lucide-react';
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
    icon: <Droplets size={32} />,
    description: 'Processo fundamental onde o metal fundido é desintegrado em finas partículas de pó. Nossa planta versátil garante pós metálicos de altíssima pureza.',
    image: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'compactacao',
    title: 'Compactação',
    icon: <FactoryIcon size={32} />,
    description: 'O pó metálico é prensado em matrizes de alta precisão com toneladas de pressão. Isso define a forma e a densidade exata da peça estrutural.',
    image: '/imagens/termo2.jpg'
  },
  {
    id: 'sinterizacao',
    title: 'Sinterização',
    icon: <Zap size={32} />,
    description: 'As peças compactadas são aquecidas em fornos de atmosfera controlada a temperaturas logo abaixo do ponto de fusão, soldando as partículas e garantindo resistência mecânica.',
    image: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?auto=format&fit=crop&q=80&w=800'
  },
  {
    id: 'acabamento',
    title: 'Acabamento e Usinagem',
    icon: <Cog size={32} />,
    description: 'Ajustes finos, impregnação de óleo (para mancais autolubrificantes) e usinagem de precisão para garantir tolerâncias micrométricas.',
    image: 'https://images.unsplash.com/photo-1581092160562-40aa08e78837?auto=format&fit=crop&q=80&w=800'
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
    <div className="flex flex-col min-h-screen bg-gray-50">
      {/* Hero Section */}
      <section className="relative min-h-[60vh] flex items-center bg-termo-dark overflow-hidden pt-32 pb-40">
        <div className="absolute inset-0 z-0">
          <div 
            className="absolute inset-0 bg-cover bg-center bg-fixed opacity-40"
            style={{ backgroundImage: `url('/imagens/termo1.jpg')` }}
          ></div>
          <div className="absolute inset-0 bg-gradient-to-t from-gray-50 via-termo-dark/80 to-termo-dark/90"></div>
        </div>

        <div className="container mx-auto px-6 relative z-10 text-center mt-8">
          <h2 className="text-termo-yellow font-bold uppercase tracking-[0.3em] mb-4">A Nossa Essência</h2>
          <h1 className="text-5xl md:text-7xl font-display font-bold text-white mb-6">
            História, Tradição e <br/><span className="text-termo-yellow">Tecnologia</span>
          </h1>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
            Desde 1953, moldando o futuro da indústria brasileira através da excelência em metalurgia do pó.
          </p>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-white relative z-20 -mt-28 mx-6 md:mx-auto max-w-6xl rounded-2xl shadow-2xl border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
          <div className="text-center px-4">
            <h3 className="text-4xl md:text-5xl font-display font-bold text-termo-dark mb-2">100<span className="text-termo-yellow">k</span></h3>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-xs md:text-sm">m² de Área Total</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl md:text-5xl font-display font-bold text-termo-dark mb-2">15<span className="text-termo-yellow">k</span></h3>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-xs md:text-sm">m² de Área Construída</p>
          </div>
          <div className="text-center px-4">
            <h3 className="text-4xl md:text-5xl font-display font-bold text-termo-dark mb-2">+70</h3>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-xs md:text-sm">Anos de Mercado</p>
          </div>
          <div className="text-center px-4 flex flex-col items-center justify-center">
            <Award size={40} className="text-termo-yellow mb-2 hidden md:block" />
            <h3 className="text-4xl md:hidden font-display font-bold text-termo-dark mb-2">ISO</h3>
            <p className="text-gray-500 font-medium uppercase tracking-wider text-xs md:text-sm">Certificação 9001</p>
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-24 bg-gray-50 overflow-hidden">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20 scroll-animate">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-termo-dark mb-4">Nossa Trajetória</h2>
            <div className="w-24 h-1 bg-termo-yellow mx-auto"></div>
          </div>

          <div className="relative max-w-5xl mx-auto">
            {/* Linha central */}
            <div className="absolute left-1/2 transform -translate-x-1/2 h-full w-1 bg-gradient-to-b from-termo-yellow/20 via-termo-yellow to-termo-yellow/20 hidden md:block"></div>

            {timelineData.map((item, index) => (
              <div key={item.year} className={`flex flex-col md:flex-row items-center mb-24 scroll-animate ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}>
                <div className="flex-1 w-full md:w-1/2 p-4 md:p-8">
                  <div className={`flex flex-col ${index % 2 === 0 ? 'md:items-start text-left' : 'md:items-end md:text-right'} items-center text-center`}>
                    <span className="text-6xl font-display font-bold text-termo-yellow/30 -mb-5 relative z-0">{item.year}</span>
                    <h3 className="text-3xl font-bold text-termo-dark mb-4 relative z-10">{item.title}</h3>
                    <p className="text-gray-600 leading-relaxed text-lg max-w-sm">{item.description}</p>
                  </div>
                </div>
                
                {/* Ponto central */}
                <div className="hidden md:flex w-16 h-16 bg-white border-4 border-termo-yellow rounded-full items-center justify-center z-10 shadow-xl relative">
                  <div className="w-4 h-4 bg-termo-dark rounded-full"></div>
                </div>

                <div className="flex-1 w-full md:w-1/2 p-4 md:p-8 mt-8 md:mt-0">
                  <div className={`relative rounded-2xl overflow-hidden shadow-2xl group ${index % 2 === 0 ? 'md:mr-8' : 'md:ml-8'}`}>
                    <div className="absolute inset-0 bg-termo-dark/20 group-hover:bg-transparent transition-colors duration-500 z-10"></div>
                    <img src={item.image} alt={item.title} className="w-full h-72 object-cover transform group-hover:scale-110 transition-transform duration-700" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Process Section (Interactive Accordion / Cards) */}
      <section className="py-24 bg-termo-dark text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-20"></div>
        
        <div className="container mx-auto px-6 relative z-10">
          <div className="text-center mb-16 scroll-animate">
            <h2 className="text-termo-yellow font-bold uppercase tracking-wider mb-2">Tecnologia Aplicada</h2>
            <h3 className="text-3xl md:text-5xl font-display font-bold mb-6">Nossos Processos Fabris</h3>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg">
              Contamos com uma estrutura de ponta para garantir o menor custo, a melhor concepção de produto e testes rigorosos de qualidade.
            </p>
          </div>

          <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto scroll-animate">
            {/* Navigation Sidebar */}
            <div className="w-full lg:w-1/3 flex flex-col gap-4">
              {processesData.map((process) => (
                <button
                  key={process.id}
                  onClick={() => setActiveProcess(process.id)}
                  className={`flex items-center gap-4 p-6 rounded-xl text-left transition-all duration-300 border ${
                    activeProcess === process.id 
                      ? 'bg-termo-yellow text-termo-dark border-termo-yellow shadow-[0_0_20px_rgba(252,211,77,0.3)]' 
                      : 'bg-white/5 text-gray-400 border-white/10 hover:bg-white/10 hover:text-white'
                  }`}
                >
                  <div className={`${activeProcess === process.id ? 'text-termo-dark' : 'text-termo-yellow'}`}>
                    {process.icon}
                  </div>
                  <span className="text-xl font-bold">{process.title}</span>
                </button>
              ))}
            </div>

            {/* Display Area */}
            <div className="w-full lg:w-2/3">
              {processesData.map((process) => (
                <div 
                  key={process.id}
                  className={`transition-all duration-500 ${activeProcess === process.id ? 'block opacity-100 translate-x-0' : 'hidden opacity-0 translate-x-10'}`}
                >
                  <div className="relative rounded-2xl overflow-hidden shadow-2xl group">
                    <img 
                      src={process.image} 
                      alt={process.title} 
                      className="w-full h-[450px] object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent"></div>
                    
                    <div className="absolute bottom-0 left-0 w-full p-8 md:p-12 backdrop-blur-md bg-black/30 border-t border-white/10">
                      <h4 className="text-3xl font-display font-bold text-termo-yellow mb-4">{process.title}</h4>
                      <p className="text-lg text-gray-200 leading-relaxed">
                        {process.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Compromisso Ambiental */}
      <section className="py-24 bg-white scroll-animate">
        <div className="container mx-auto px-6 max-w-5xl">
          <div className="flex flex-col md:flex-row items-center gap-12 bg-gray-50 rounded-3xl p-8 md:p-12 border border-gray-200 shadow-xl relative overflow-hidden group hover:border-termo-yellow/50 transition-colors duration-500">
            <div className="absolute -right-10 -top-10 text-termo-yellow/5 transform group-hover:scale-110 group-hover:rotate-12 transition-transform duration-1000">
              <Leaf size={350} />
            </div>
            
            <div className="w-24 h-24 bg-termo-yellow/20 rounded-full flex items-center justify-center flex-shrink-0 relative z-10 shadow-inner">
              <Leaf size={48} className="text-termo-yellowDark" />
            </div>
            
            <div className="relative z-10">
              <h3 className="text-3xl font-display font-bold text-termo-dark mb-4">Compromisso Ambiental</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                A sustentabilidade é uma prioridade na condução de nossas decisões técnicas. Garantimos o controle rigoroso de materiais particulados e o <strong>reuso de água industrial</strong>, atendendo plenamente todas as regulamentações em vigor. Cuidar do meio ambiente faz parte da nossa essência de produzir de forma inteligente.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-termo-yellow text-termo-dark text-center">
        <div className="container mx-auto px-6 scroll-animate">
          <h2 className="text-4xl md:text-5xl font-display font-bold mb-6">Pronto para conhecer nossas soluções?</h2>
          <p className="text-xl mb-10 max-w-2xl mx-auto opacity-90 font-medium">
            Descubra por que a Termosinter é líder no mercado de peças sinterizadas de alta complexidade.
          </p>
          <button 
            onClick={() => navigate(PageRoute.CATALOG)}
            className="px-10 py-5 bg-termo-dark text-white font-bold text-lg uppercase tracking-wider rounded hover:bg-black transition-all duration-300 shadow-2xl hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] transform hover:-translate-y-1"
          >
            Acessar o Catálogo Completo
          </button>
        </div>
      </section>
    </div>
  );
};

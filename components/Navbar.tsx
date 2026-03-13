import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, ChevronRight, Search, ChevronDown } from 'lucide-react';
import { PageRoute, Product } from '../types';
import { fetchProducts } from '../api';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchField, setSearchField] = useState('Todos');
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      const strapiProducts = await fetchProducts();
      const mappedProducts: Product[] = strapiProducts.map(sp => ({
        id: sp.id,
        name: sp.name,
        category: (sp.category?.name as any) || 'Outros',
        description: sp.applied || '',
        material: sp.specs?.material || '',
        price: '',
        specs: sp.specs || {},
        images: []
      }));
      setProducts(mappedProducts);
    };
    
    if (currentRoute === PageRoute.HOME) {
      loadProducts();
    }
  }, [currentRoute]);

  const specKeys = useMemo(() => {
    const keys = new Set<string>();
    products.forEach(p => {
      if (p.specs) {
        Object.keys(p.specs).forEach(k => keys.add(k));
      }
    });
    return Array.from(keys);
  }, [products]);

  const navLinks = [
    { name: 'Início', route: PageRoute.HOME },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim() !== '') {
      sessionStorage.setItem('catalogSearchTerm', searchTerm);
      sessionStorage.setItem('catalogSearchField', searchField);
      handleNav(PageRoute.CATALOG);
      setSearchTerm('');
    } else {
      handleNav(PageRoute.CATALOG);
    }
  };

  const isHome = currentRoute === PageRoute.HOME;
  const useDarkText = !scrolled && !isOpen && !isHome;

  const textColorClass = useDarkText ? 'text-termo-dark' : 'text-white';
  const navLinkClass = useDarkText ? 'text-gray-600 hover:text-termo-yellowDark' : 'text-gray-300 hover:text-termo-yellow';
  const menuIconClass = useDarkText ? 'text-termo-dark' : 'text-white';

  return (
    <nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled || isOpen ? 'bg-termo-dark shadow-xl py-4' : 'bg-transparent py-6'
      }`}
    >
      <div className="container mx-auto px-6 flex justify-between items-center gap-6">
        <div 
          onClick={() => handleNav(PageRoute.HOME)}
          className="cursor-pointer flex items-center group flex-shrink-0"
        >
          <span className={`text-2xl font-display font-bold tracking-widest transition-colors ${textColorClass}`}>
            TERMO<span className="text-termo-yellow">SINTER</span>
          </span>
        </div>

        {isHome && (
          <form 
            onSubmit={handleSearch}
            className="hidden lg:flex flex-grow justify-center px-4"
          >
            <div className="relative w-full max-w-2xl group/search shadow-[0_0_10px_rgba(252,211,77,0.1)] rounded-lg hover:shadow-[0_0_15px_rgba(252,211,77,0.3)] transition-shadow duration-300">
               <div className="absolute -inset-0.5 bg-gradient-to-r from-termo-yellow to-yellow-500 rounded-lg blur opacity-20 group-hover/search:opacity-40 transition-opacity duration-300"></div>
               <div className="relative flex items-center bg-white rounded-lg overflow-hidden shadow-lg border border-gray-200 hover:border-termo-yellow/50 focus-within:border-termo-yellow focus-within:ring-1 focus-within:ring-termo-yellow transition-all">
                  <div className="relative border-r border-gray-200">
                    <select
                      value={searchField}
                      onChange={(e) => setSearchField(e.target.value)}
                      className="appearance-none pl-4 pr-8 py-3 bg-gray-50 text-sm font-bold text-termo-dark focus:outline-none cursor-pointer h-full outline-none ring-0"
                    >
                      <option value="Todos">Todos</option>
                      <optgroup label="Especificações">
                        <option value="Nome">Nome</option>
                        <option value="Aplicação">Aplicação</option>
                        <option value="Material">Material</option>
                        {specKeys.map(key => {
                          const displayLabel = key === 'fabricator' 
                            ? 'Fabricante' 
                            : key.charAt(0).toUpperCase() + key.slice(1);
                          return (
                            <option key={key} value={key}>{displayLabel}</option>
                          );
                        })}
                      </optgroup>
                    </select>
                    <ChevronDown className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 pointer-events-none" size={14} />
                  </div>
                 
                 <input 
                   type="text"
                   placeholder="O que você está procurando? (Ex: Válvula, Cobre, Inox)"
                   value={searchTerm}
                   onChange={(e) => setSearchTerm(e.target.value)}
                   className="w-full bg-transparent text-gray-800 placeholder-gray-400 px-4 py-3 focus:outline-none font-medium peer"
                 />
                 <button 
                   type="submit" 
                   className="bg-white peer-focus:bg-termo-yellow hover:bg-termo-yellow text-termo-dark border-l border-gray-200 peer-focus:border-transparent px-6 py-3 font-bold transition-colors flex items-center gap-2 group-hover/search:text-termo-dark"
                 >
                   <Search size={20} />
                   <span>Buscar</span>
                 </button>
               </div>
            </div>
          </form>
        )}

        <div className="hidden md:flex items-center space-x-8 flex-shrink-0">
          {!isHome && navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNav(link.route)}
              className={`text-sm font-medium tracking-wide uppercase transition-colors ${
                currentRoute === link.route 
                  ? 'text-termo-yellow border-b-2 border-termo-yellow' 
                  : navLinkClass
              }`}
            >
              {link.name}
            </button>
          ))}
          <button 
            onClick={() => handleNav(PageRoute.CATALOG)}
            className="px-5 py-2 bg-termo-yellow text-termo-dark font-bold text-sm uppercase tracking-wider rounded hover:bg-termo-yellowDark transition-colors shadow-lg shadow-yellow-500/20"
          >
            Catálogo de Produtos
          </button>
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className={menuIconClass}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-termo-dark border-t border-gray-800 flex flex-col p-6 shadow-2xl animate-fade-in-down">
          {!isHome && navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNav(link.route)}
              className="flex items-center justify-between w-full py-4 text-left text-gray-300 border-b border-gray-800 hover:text-termo-yellow"
            >
              <span className="text-lg font-medium">{link.name}</span>
              <ChevronRight size={16} />
            </button>
          ))}
          <button 
            onClick={() => handleNav(PageRoute.CATALOG)}
            className="mt-6 w-full py-3 bg-termo-yellow text-termo-dark font-bold uppercase rounded text-center"
          >
            Ver Catálogo
          </button>
        </div>
      )}
    </nav>
  );
};
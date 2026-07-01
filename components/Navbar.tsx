import React, { useState, useEffect, useMemo } from 'react';
import { Menu, X, ChevronRight } from 'lucide-react';
import { PageRoute } from '../types';

interface NavbarProps {
  currentRoute: string;
  navigate: (route: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({ currentRoute, navigate }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Início', route: PageRoute.HOME },
    { name: 'A Empresa', route: PageRoute.ABOUT },
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setIsOpen(false);
  };



  const isHome = currentRoute === PageRoute.HOME;
  const isDarkHero = currentRoute === PageRoute.HOME || currentRoute === PageRoute.ABOUT;
  const useDarkText = !scrolled && !isOpen && !isDarkHero;

  const textColorClass = useDarkText ? 'text-termo-dark' : 'text-white';
  const menuIconClass = useDarkText ? 'text-termo-dark' : 'text-white';

  const glassBase = "px-5 py-2 rounded-xl backdrop-blur-md border transition-all duration-300 text-sm font-bold tracking-wider uppercase";
  
  const glassInactiveLight = "bg-white/5 border-white/10 text-gray-300 hover:bg-white/10 hover:text-white hover:border-white/20 hover:shadow-lg [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]";
  const glassActiveLight = "bg-white/20 border-white/40 text-termo-yellow [text-shadow:_0_1px_3px_rgb(0_0_0_/_80%)]";
  
  const glassInactiveDark = "bg-black/5 border-black/10 text-gray-600 hover:bg-black/10 hover:text-termo-dark hover:border-black/20";
  const glassActiveDark = "bg-black/15 border-black/30 text-termo-dark";

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



        <div className="hidden md:flex items-center space-x-4 flex-shrink-0">
          {navLinks.map((link) => {
            const isActive = currentRoute === link.route;
            let btnClass = '';
            
            if (useDarkText) {
              btnClass = isActive ? glassActiveDark : glassInactiveDark;
            } else {
              btnClass = isActive ? glassActiveLight : glassInactiveLight;
            }

            return (
              <button
                key={link.name}
                onClick={() => handleNav(link.route)}
                className={`${glassBase} ${btnClass}`}
              >
                {link.name}
              </button>
            );
          })}
        </div>

        <div className="md:hidden">
          <button onClick={() => setIsOpen(!isOpen)} className={menuIconClass}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden absolute top-full left-0 w-full bg-termo-dark border-t border-gray-800 flex flex-col p-6 shadow-2xl animate-fade-in-down">
          {navLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => handleNav(link.route)}
              className="flex items-center justify-between w-full py-4 text-left text-gray-300 border-b border-gray-800 hover:text-termo-yellow"
            >
              <span className="text-lg font-medium">{link.name}</span>
              <ChevronRight size={16} />
            </button>
          ))}

        </div>
      )}
    </nav>
  );
};
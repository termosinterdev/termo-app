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
  ];

  const handleNav = (route: string) => {
    navigate(route);
    setIsOpen(false);
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

        </div>
      )}
    </nav>
  );
};
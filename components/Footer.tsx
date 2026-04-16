import React from 'react';
import { PageRoute } from '../types';
import { Facebook, Linkedin, Instagram, Mail, Phone, MapPin, Settings } from 'lucide-react';

interface FooterProps {
  navigate: (route: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ navigate }) => {
  return (
    <footer className="bg-termo-dark text-white pt-20 pb-10 border-t-4 border-termo-yellow">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-16">
          
          <div>
             <div className="flex items-center mb-6">
              <span className="text-xl font-display font-bold tracking-widest text-white">
                TERMO<span className="text-termo-yellow">SINTER</span>
              </span>
            </div>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Indústria brasileira referência em metalurgia do pó. Inovação, qualidade e precisão em cada componente produzido desde 1953.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-400 hover:text-termo-yellow transition-colors"><Linkedin size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-termo-yellow transition-colors"><Instagram size={20} /></a>
              <a href="#" className="text-gray-400 hover:text-termo-yellow transition-colors"><Facebook size={20} /></a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-termo-yellow">Navegação</h4>
            <ul className="space-y-3 text-sm text-gray-400">
              <li><button onClick={() => navigate(PageRoute.HOME)} className="hover:text-white transition-colors">Início</button></li>
              <li><button onClick={() => navigate(PageRoute.CATALOG)} className="hover:text-white transition-colors">Catálogo de Produtos</button></li>
              <li className="pt-2">
                <a 
                  href="http://localhost:1337/admin" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-gray-700 hover:text-termo-yellow transition-colors"
                  aria-label="Acesso Administrativo"
                >
                  <Settings size={16} />
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-termo-yellow">Contato</h4>
            <ul className="space-y-4 text-sm text-gray-400">
              <li className="flex items-start gap-3">
                <MapPin size={18} className="text-termo-yellow shrink-0 mt-1" />
                <span>Rua Milton José Nunes Fernandes, 1.500 Chácara Santa Maria<br/>Guaratinguetá  - São Paulo, SP - Brasil</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="text-termo-yellow shrink-0" />
                <span>+55 (11) 3122-1146</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="text-termo-yellow shrink-0" />
                <span>contato@termosinter.com.br</span>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-display font-bold text-lg mb-6 text-termo-yellow">Certificações</h4>
            <div className="flex gap-4">
              <div className="w-16 h-16 border border-gray-700 rounded flex items-center justify-center text-xs text-gray-500 font-bold bg-gray-900">
                ISO<br/>9001
              </div>
              <div className="w-16 h-16 border border-gray-700 rounded flex items-center justify-center text-xs text-gray-500 font-bold bg-gray-900">
                IATF<br/>16949
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center text-xs text-gray-500">
          <p>&copy; {new Date().getFullYear()} Termosinter Indústria Metalúrgica Ltda. Todos os direitos reservados.</p>
          <div className="mt-4 md:mt-0 flex gap-6">
            <a href="#" className="hover:text-white">Política de Privacidade</a>
            <a href="#" className="hover:text-white">Termos de Uso</a>
          </div>
        </div>
      </div>
    </footer>
  );
};

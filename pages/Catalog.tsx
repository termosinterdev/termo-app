import React, { useState, useMemo, useEffect } from 'react';
import { fetchProducts } from '../api';
import { Product } from '../types';
import { ProductCard } from '../components/ProductCard';
import { Search, Filter, ChevronDown, Loader2 } from 'lucide-react';

interface CatalogProps {
  navigate: (route: string) => void;
}

export const Catalog: React.FC<CatalogProps> = ({ navigate }) => {
  const [searchTerm, setSearchTerm] = useState(() => sessionStorage.getItem('catalogSearchTerm') || '');
  const [searchField, setSearchField] = useState(() => sessionStorage.getItem('catalogSearchField') || 'Todos');
  const [selectedCategory, setSelectedCategory] = useState('Todas');
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Limpa a busca do sessionStorage para não prender a pesquisa se o usuário sair e voltar
    sessionStorage.removeItem('catalogSearchTerm');
    sessionStorage.removeItem('catalogSearchField');
    
    const loadProducts = async () => {
      setLoading(true);
      const strapiProducts = await fetchProducts();
      
      const mappedProducts: Product[] = strapiProducts.map(sp => ({
        id: sp.id,
	code: sp.code,
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
      
      setProducts(mappedProducts);
      setLoading(false);
    };

    loadProducts();
  }, []);

  const categories = ['Todas', ...Array.from(new Set(products.map(p => p.category)))];

  const specKeys = useMemo(() => {
    const keys = new Set<string>();
    products.forEach(p => {
      if (p.specs) {
        Object.keys(p.specs).forEach(k => keys.add(k));
      }
    });
    return Array.from(keys);
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      let matchesSearch = false;
      const lowerSearch = searchTerm.toLowerCase();
      
      if (!searchTerm) {
        matchesSearch = true;
      } else if (searchField === 'Todos') {
        matchesSearch = product.name.toLowerCase().includes(lowerSearch) ||
			product.code.toLowerCase().includes(lowerSearch) || 
                        product.description.toLowerCase().includes(lowerSearch) ||
                        product.material.toLowerCase().includes(lowerSearch) ||
                        (!!product.specs && Object.values(product.specs).some(val => String(val).toLowerCase().includes(lowerSearch)));
      } else if (searchField === 'code') {
        matchesSearch = product.code.toLowerCase().includes(lowerSearch);
      } else if (searchField === 'name') {
        matchesSearch = product.description.toLowerCase().includes(lowerSearch);
      } else if (searchField === 'description') {
        matchesSearch = product.material.toLowerCase().includes(lowerSearch) || (!!product.specs?.material && String(product.specs.material).toLowerCase().includes(lowerSearch));
      } else {
        // Buscar em chave dinâmica do objeto specs (ex: fabricator, diametro)
        matchesSearch = !!product.specs && product.specs[searchField] !== undefined && String(product.specs[searchField]).toLowerCase().includes(lowerSearch);
      }

      const matchesCategory = selectedCategory === 'Todas' || product.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, searchField, selectedCategory, products]);

  return (
    <div className="pt-24 pb-20 min-h-screen bg-gray-50">
      <div className="container mx-auto px-6">
        
        <div className="mb-12 text-center">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-termo-dark mb-4">CATÁLOGO DE PRODUTOS</h1>
          <p className="text-gray-600 max-w-2xl mx-auto">Explore nossa linha completa de produtos sinterizados. Utilize os filtros abaixo para te ajudar a encontrar o que precisa.</p>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md mb-12 border border-gray-100">
          <div className="flex flex-col md:flex-row gap-6 justify-between items-center">
            
            <div className="flex flex-col sm:flex-row gap-3 w-full flex-grow">
              <div className="relative w-full sm:w-1/3 md:w-1/4 max-w-xs">
                <select
                  value={searchField}
                  onChange={(e) => setSearchField(e.target.value)}
                  className="w-full appearance-none pl-4 pr-10 py-3 bg-white border border-gray-200 rounded text-sm text-gray-600 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow transition-all cursor-pointer"
                >
                  <option value="Todos">Todos</option>
                  <optgroup label="Especificações">
                    <option value="code">Código</option>
                    <option value="name">Nome</option>
                    <option value="description">Aplicação</option>
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
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
              <div className="relative w-full flex-grow">
                <input
                  type="text"
                  placeholder={`Buscar por ${searchField === 'Todos' ? 'qualquer detalhe' : searchField === 'fabricator' ? 'fabricante' : searchField.toLowerCase()}...`}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow transition-all"
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              </div>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto flex-shrink-0">
              <Filter size={20} className="text-termo-dark hidden md:block mr-2" />
              
              <button
                onClick={() => setSelectedCategory('Todas')}
                className={`px-6 py-3 rounded text-sm font-bold uppercase transition-all border ${
                  selectedCategory === 'Todas' 
                    ? 'bg-termo-dark text-termo-yellow border-termo-dark shadow-md' 
                    : 'bg-white text-gray-600 border-gray-200 hover:border-termo-yellow hover:text-termo-dark'
                }`}
              >
                Todas
              </button>

              <div className="relative flex-grow md:flex-grow-0 min-w-[200px]">
                <select
                  value={selectedCategory === 'Todas' ? '' : selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value)}
                  className={`w-full appearance-none pl-4 pr-10 py-3 rounded text-sm font-bold uppercase border focus:outline-none focus:ring-1 focus:ring-termo-yellow transition-colors cursor-pointer ${
                    selectedCategory !== 'Todas'
                    ? 'bg-white border-termo-yellow text-termo-dark shadow-sm'
                    : 'bg-white border-gray-200 text-gray-600 hover:border-gray-300'
                  }`}
                >
                  <option value="" disabled>Selecionar Categoria</option>
                  {categories.filter(cat => cat !== 'Todas').map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none" size={16} />
              </div>
            </div>

          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 size={48} className="text-termo-yellow animate-spin mb-4" />
            <h3 className="text-xl font-bold text-gray-700">Carregando catálogo...</h3>
          </div>
        ) : filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map(product => (
              <ProductCard key={product.id} product={product} navigate={navigate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <div className="inline-block p-6 bg-gray-100 rounded-full mb-4">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-700 mb-2">Nenhum produto encontrado</h3>
            <p className="text-gray-500">Tente ajustar seus termos de busca ou filtros.</p>
            <button 
              onClick={() => {setSearchTerm(''); setSelectedCategory('Todas');}}
              className="mt-6 text-termo-dark font-bold hover:text-termo-yellowDark underline"
            >
              Limpar filtros
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

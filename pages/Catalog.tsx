import React, { useState, useMemo, useEffect, useRef } from 'react';
import { fetchProducts, mapStrapiProduct } from '../api';
import { Product } from '../types';
import { DimensionCard, DIMENSION_LABELS } from '../components/DimensionCard';
import { ApplicationDetailCard } from '../components/ApplicationDetailCard';
import { 
  Search, 
  Ruler, 
  Car, 
  Tag, 
  RotateCcw, 
  Loader2, 
  ChevronRight, 
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  X
} from 'lucide-react';

interface CatalogProps {
  navigate: (route: string) => void;
}

type CatalogViewMode = 'dimensional' | 'application';

const MAX_METRICS = 4;

export const Catalog: React.FC<CatalogProps> = ({ navigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<CatalogViewMode>('dimensional');

  const [codeFilter, setCodeFilter] = useState('');
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [applicationSearch, setApplicationSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('Todas');

  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setMetricDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  useEffect(() => {
    const loadProducts = async () => {
      setLoading(true);
      const strapiProducts = await fetchProducts();
      const mapped = strapiProducts.map(mapStrapiProduct);
      setProducts(mapped);
      setLoading(false);
    };
    loadProducts();
  }, []);

  const categories = useMemo(() => {
    return ['Todas', ...Array.from(new Set(products.map(p => p.category).filter(Boolean)))];
  }, [products]);

  const toggleMetric = (key: string) => {
    setSelectedMetrics(prev => {
      if (prev.includes(key)) {
        setMetricValues(vals => { const next = { ...vals }; delete next[key]; return next; });
        return prev.filter(k => k !== key);
      }
      if (prev.length >= MAX_METRICS) return prev;
      return [...prev, key];
    });
  };

  const setMetricValue = (key: string, val: string) => {
    setMetricValues(prev => ({ ...prev, [key]: val }));
  };

  const removeMetric = (key: string) => {
    setSelectedMetrics(prev => prev.filter(k => k !== key));
    setMetricValues(prev => { const next = { ...prev }; delete next[key]; return next; });
  };

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      if (codeFilter.trim()) {
        const query = codeFilter.toLowerCase().trim();
        const codeMatch = product.code?.toLowerCase().includes(query) || false;
        const nameMatch = product.name?.toLowerCase().includes(query) || false;
        if (!codeMatch && !nameMatch) return false;
      }

      if (viewMode === 'application') {
        if (vehicleFilter.trim()) {
          const query = vehicleFilter.toLowerCase().trim();
          const appliedMatch = product.applied?.toLowerCase().includes(query) || false;
          const descMatch = product.description?.toLowerCase().includes(query) || false;
          const specVehicleMatch = product.specs 
            ? Object.values(product.specs).some(val => String(val).toLowerCase().includes(query))
            : false;
          if (!appliedMatch && !descMatch && !specVehicleMatch) return false;
        }
        if (applicationSearch.trim()) {
          const query = applicationSearch.toLowerCase().trim();
          const appliedMatch = product.applied?.toLowerCase().includes(query) || false;
          const descMatch = product.description?.toLowerCase().includes(query) || false;
          const nameMatch = product.name?.toLowerCase().includes(query) || false;
          const codeMatch = product.code?.toLowerCase().includes(query) || false;
          if (!appliedMatch && !descMatch && !nameMatch && !codeMatch) return false;
        }
        if (selectedCategory !== 'Todas' && product.category !== selectedCategory) return false;
      } else if (viewMode === 'dimensional') {
        for (const metricKey of selectedMetrics) {
          const query = (metricValues[metricKey] || '').trim();
          if (!query) continue;
          const val = (product as any)[metricKey]
            || (product.dimensions && (product.dimensions as any)[metricKey])
            || (product.specs && (product.specs as any)[metricKey]);
          if (!val || !String(val).toLowerCase().includes(query.toLowerCase())) return false;
        }
      }
      return true;
    });
  }, [products, codeFilter, vehicleFilter, applicationSearch, selectedCategory, viewMode, selectedMetrics, metricValues]);

  const hasActiveFilters = Boolean(
    codeFilter.trim() || vehicleFilter.trim() || applicationSearch.trim()
    || selectedCategory !== 'Todas' || selectedMetrics.some(k => metricValues[k]?.trim())
  );

  const handleResetFilters = () => {
    setCodeFilter('');
    setVehicleFilter('');
    setApplicationSearch('');
    setSelectedCategory('Todas');
    setSelectedMetrics([]);
    setMetricValues({});
  };

  const inputCls = "w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow/30 transition-all";
  const labelCls = "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Full-Width Banner — dark industrial */}
      <div className="bg-[#0f0f0f] relative overflow-hidden pt-32 pb-16 mb-0 border-b-4 border-termo-yellow">
        {/* Grid texture overlay */}
        <div
          className="absolute inset-0 opacity-10 pointer-events-none"
          style={{
            backgroundImage: 'linear-gradient(rgba(252,211,77,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(252,211,77,0.4) 1px, transparent 1px)',
            backgroundSize: '40px 40px'
          }}
        />
        <div className="absolute top-0 right-0 w-2 h-full bg-termo-yellow" />

        <div className="container mx-auto px-4 sm:px-6 relative z-10">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-8 h-0.5 bg-termo-yellow" />
            <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.3em] text-[10px] md:text-xs">
              Linha de Produtos Termosinter
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-display font-black text-white mb-6 tracking-tight leading-none">
            CATÁLOGO <span className="text-white/20">TÉCNICO</span>
          </h1>
          <p className="text-gray-400 max-w-2xl text-base md:text-lg leading-relaxed border-l-2 border-termo-yellow/30 pl-4">
            Consulte nossa linha sinterizada através do catálogo dimensional de medidas ou localize peças pelo modelo do veículo e aplicação.
          </p>
        </div>
      </div>

      {/* Content area — light background for usability */}
      <div className="container mx-auto px-4 sm:px-6 py-10">

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div className="flex w-full sm:w-auto bg-white border border-gray-200 overflow-hidden shadow-sm">
            <button
              onClick={() => setViewMode('dimensional')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 text-sm font-black tracking-wider uppercase transition-all duration-200 ${
                viewMode === 'dimensional'
                  ? 'bg-termo-yellow text-termo-dark'
                  : 'text-gray-500 hover:text-termo-dark hover:bg-gray-50'
              }`}
            >
              <LayoutGrid size={16} />
              <span>Dimensional</span>
            </button>
            <button
              onClick={() => setViewMode('application')}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 text-sm font-black tracking-wider uppercase transition-all duration-200 ${
                viewMode === 'application'
                  ? 'bg-termo-yellow text-termo-dark'
                  : 'text-gray-500 hover:text-termo-dark hover:bg-gray-50'
              }`}
            >
              <TableIcon size={16} />
              <span>Aplicação</span>
            </button>
          </div>
          <div className="text-xs font-mono text-gray-500 flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-termo-yellow animate-pulse"></span>
            <strong className="text-termo-dark">{filteredProducts.length}</strong>{' '}
            {filteredProducts.length === 1 ? 'item' : 'itens'}
          </div>
        </div>

        {/* ===== FILTROS ===== */}
        <div className="bg-white border border-gray-200 shadow-sm mb-8 relative z-20">
          {/* Left yellow bar */}
          <div className="absolute top-0 left-0 bottom-0 w-1 bg-termo-yellow z-10" />

          {/* Header da barra de filtros */}
          <div className="flex items-center justify-between px-6 py-4 bg-gray-50 border-b border-gray-200 pl-8">
            <div className="flex items-center gap-3">
              <SlidersHorizontal size={16} className="text-termo-yellow" />
              <span className="text-sm font-black tracking-widest uppercase text-termo-dark">Filtros de Pesquisa</span>
              {hasActiveFilters && (
                <span className="ml-2 px-2 py-0.5 bg-termo-yellow text-termo-dark text-[10px] font-bold uppercase tracking-wider rounded-full">
                  ativo
                </span>
              )}
            </div>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition-colors font-bold uppercase tracking-wider"
              >
                <RotateCcw size={12} />
                <span>Limpar tudo</span>
              </button>
            )}
          </div>

          <div className="p-6 pl-8 space-y-6">
            {/* Linha de filtros principais */}
            <div className={`grid gap-4 ${viewMode === 'application' ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1 md:grid-cols-4'}`}>

              {/* Código */}
              <div className={viewMode === 'dimensional' ? 'md:col-span-1' : ''}>
                <label className={labelCls}>
                  <Tag size={11} className="text-termo-yellow" />
                  Código da Peça
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Ex: TS-1042, 204..."
                    value={codeFilter}
                    onChange={(e) => setCodeFilter(e.target.value)}
                    className={inputCls}
                  />
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                  {codeFilter && (
                    <button onClick={() => setCodeFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                      <X size={13} />
                    </button>
                  )}
                </div>
              </div>

              {/* Application-only filters */}
              {viewMode === 'application' && (
                <>
                  <div>
                    <label className={labelCls}>
                      <Car size={11} className="text-termo-yellow" />
                      Veículo / Aplicação
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        placeholder="Ex: Gol, Uno, Scania..."
                        value={vehicleFilter}
                        onChange={(e) => setVehicleFilter(e.target.value)}
                        className={inputCls}
                      />
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                      {vehicleFilter && (
                        <button onClick={() => setVehicleFilter('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                          <X size={13} />
                        </button>
                      )}
                    </div>
                  </div>

                  <div>
                    <label className={labelCls}>
                      Categoria
                    </label>
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-3 py-2.5 bg-white border border-gray-200 rounded-none text-sm text-gray-800 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow/30 transition-all cursor-pointer appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat} value={cat} className="bg-white">{cat}</option>
                      ))}
                    </select>
                  </div>
                </>
              )}

              {/* Dimensional: seletor de métricas */}
              {viewMode === 'dimensional' && (
                <div className="md:col-span-3">
                  <label className={labelCls}>
                    <Ruler size={11} className="text-termo-yellow" />
                    Métricas Dimensionais
                    <span className="ml-auto text-[10px] text-gray-400 font-normal normal-case tracking-normal">
                      {selectedMetrics.length}/{MAX_METRICS} selecionadas
                    </span>
                  </label>

                  <div className="relative" ref={dropdownRef}>
                    <button
                      type="button"
                      onClick={() => setMetricDropdownOpen(v => !v)}
                      className={`w-full flex items-center justify-between px-3 py-2.5 bg-white border text-sm text-left transition-all focus:outline-none ${
                        metricDropdownOpen ? 'border-termo-yellow ring-1 ring-termo-yellow/30' : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <span className={selectedMetrics.length === 0 ? 'text-gray-400' : 'text-gray-800 font-medium'}>
                        {selectedMetrics.length === 0
                          ? 'Selecione até 4 métricas...'
                          : `${selectedMetrics.length} métrica${selectedMetrics.length > 1 ? 's' : ''} selecionada${selectedMetrics.length > 1 ? 's' : ''}`}
                      </span>
                      <ChevronDown
                        size={14}
                        className={`text-gray-400 transition-transform duration-200 flex-shrink-0 ${metricDropdownOpen ? 'rotate-180' : ''}`}
                      />
                    </button>

                    {metricDropdownOpen && (
                      <div className="absolute top-full left-0 w-full mt-1.5 z-50 bg-white border border-gray-200 shadow-xl overflow-hidden">
                        <div className="max-h-60 overflow-y-auto py-1">
                          {Object.entries(DIMENSION_LABELS).map(([key, meta]) => {
                            const isSelected = selectedMetrics.includes(key);
                            const isDisabled = !isSelected && selectedMetrics.length >= MAX_METRICS;
                            return (
                              <button
                                key={key}
                                type="button"
                                onClick={() => !isDisabled && toggleMetric(key)}
                                className={`w-full flex items-center gap-5 px-4 py-3.5 text-left text-sm transition-colors ${
                                  isSelected
                                    ? 'bg-termo-yellow/10 text-termo-dark font-medium'
                                    : isDisabled
                                    ? 'text-gray-400 cursor-not-allowed'
                                    : 'text-gray-700 hover:bg-gray-50 hover:text-termo-dark'
                                }`}
                              >
                                <span className={`w-4 h-4 flex-shrink-0 rounded border flex items-center justify-center transition-colors ${
                                  isSelected ? 'bg-termo-yellow border-termo-yellow' : 'border-gray-300'
                                }`}>
                                  {isSelected && (
                                    <svg viewBox="0 0 10 8" className="w-2.5 h-2">
                                      <path d="M1 4l2.5 3L9 1" stroke="#111" strokeWidth="1.8" fill="none" strokeLinecap="round" strokeLinejoin="round"/>
                                    </svg>
                                  )}
                                </span>
                                <span className="font-mono text-[11px] text-gray-400 w-32 flex-shrink-0 whitespace-nowrap">{meta.short}</span>
                                <span className="flex-1 truncate">{meta.label}</span>
                              </button>
                            );
                          })}
                        </div>
                        {selectedMetrics.length >= MAX_METRICS && (
                          <div className="px-4 py-2 border-t border-gray-100 text-[11px] text-termo-yellow font-bold bg-termo-yellow/5">
                            Limite de {MAX_METRICS} métricas atingido
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Chips de filtros ativos (application mode) */}
            {viewMode === 'application' && hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider self-center mr-1">Ativos:</span>
                {codeFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-termo-dark text-termo-yellow text-xs font-mono font-bold border border-termo-yellow/30">
                    <Tag size={10} /> {codeFilter}
                    <button onClick={() => setCodeFilter('')} className="ml-1 hover:text-white"><X size={12}/></button>
                  </span>
                )}
                {vehicleFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-termo-dark text-termo-yellow text-xs font-bold border border-termo-yellow/30">
                    <Car size={10} /> {vehicleFilter}
                    <button onClick={() => setVehicleFilter('')} className="ml-1 hover:text-white"><X size={12}/></button>
                  </span>
                )}
                {selectedCategory !== 'Todas' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 rounded">
                    {selectedCategory}
                    <button onClick={() => setSelectedCategory('Todas')} className="ml-1 hover:text-termo-yellow"><X size={12}/></button>
                  </span>
                )}
              </div>
            )}

            {/* Linha 2: Inputs por métrica (dimensional) */}
            {viewMode === 'dimensional' && selectedMetrics.length > 0 && (
              <div className="border-t border-gray-200 pt-5">
                <p className="text-[11px] uppercase tracking-widest text-gray-500 font-bold mb-3">
                  Valores por Métrica
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                  {selectedMetrics.map((key) => {
                    const meta = DIMENSION_LABELS[key];
                    return (
                      <div key={key}>
                        <label className="flex items-center justify-between mb-1.5">
                          <span className="text-[10px] font-mono font-bold text-termo-yellow uppercase tracking-wider truncate pr-2">
                            {meta.short}
                          </span>
                          <button
                            type="button"
                            onClick={() => removeMetric(key)}
                            className="text-gray-400 hover:text-red-500 transition-colors flex-shrink-0"
                            title="Remover filtro"
                          >
                            <X size={12} />
                          </button>
                        </label>
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Valor (mm)..."
                            value={metricValues[key] || ''}
                            onChange={(e) => setMetricValue(key, e.target.value)}
                            className="w-full pl-8 pr-3 py-2 bg-white border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow/30 transition-all font-mono"
                          />
                          <Ruler className="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" size={11} />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Conteúdo */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 shadow-sm mt-8">
            <Loader2 size={44} className="text-termo-yellow animate-spin mb-4" />
            <h3 className="text-lg font-black text-gray-500 uppercase tracking-widest text-sm">Carregando catálogo...</h3>
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-200 shadow-sm p-8 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rotate-45 transform translate-x-16 -translate-y-16" />
            <div className="inline-block p-6 bg-gray-50 border border-gray-100 mb-6 relative z-10">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-3xl font-display font-black text-termo-dark mb-4 tracking-wide">NENHUM PRODUTO ENCONTRADO</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Não encontramos resultados com os filtros informados. Tente ajustar o código ou o veículo pesquisado.
            </p>
            {hasActiveFilters && (
              <button
                onClick={handleResetFilters}
                className="px-8 py-3 bg-gray-100 border border-gray-200 text-gray-600 font-black text-xs uppercase tracking-widest transition-colors hover:bg-termo-yellow hover:text-termo-dark hover:border-termo-yellow"
              >
                Limpar todos os filtros
              </button>
            )}
          </div>
        ) : viewMode === 'dimensional' ? (

          /* CATÁLOGO DIMENSIONAL */
          <div className="mt-6">
            <div className="mb-8 pb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-2">
              <div>
                <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-[10px] block mb-2">Pesquisa por medidas</span>
                <h2 className="text-3xl font-display font-black text-termo-dark flex items-center gap-3">
                  <Ruler size={24} className="text-termo-yellow flex-shrink-0" />
                  Catálogo Dimensional
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mt-1 border-l-2 border-termo-yellow/50 pl-3">
                  Visualização de medidas, cotas e especificações técnicas dos produtos sinterizados.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 items-start">
              {filteredProducts.map(product => (
                <DimensionCard
                  key={product.id}
                  product={product}
                  navigate={navigate}
                  onOpenDetail={() => setSelectedProduct(product)}
                />
              ))}
            </div>
          </div>

        ) : (

          /* CATÁLOGO DE APLICAÇÃO */
          <div className="mt-6">
            <div className="mb-8 pb-4 border-b border-gray-200 flex flex-col sm:flex-row justify-between items-start sm:items-end gap-6">
              <div>
                <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-[10px] block mb-2">Pesquisa por modelo</span>
                <h2 className="text-3xl font-display font-black text-termo-dark flex items-center gap-3">
                  <Car size={24} className="text-termo-yellow flex-shrink-0" />
                  Catálogo de Aplicação
                </h2>
                <p className="text-sm text-gray-500 leading-relaxed mt-1 border-l-2 border-termo-yellow/50 pl-3">
                  Clique em qualquer item da tabela para abrir o card de detalhamento completo.
                </p>
              </div>

              <div className="relative w-full sm:w-80 flex-shrink-0">
                <input
                  type="text"
                  placeholder="Filtrar tabela..."
                  value={applicationSearch}
                  onChange={(e) => setApplicationSearch(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white border border-gray-200 text-xs text-gray-800 placeholder-gray-400 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow/30 transition-colors shadow-sm"
                />
                <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
              </div>
            </div>

            <div className="bg-white border border-gray-200 overflow-hidden shadow-sm relative">
              {/* Decorative top border */}
              <div className="absolute top-0 left-0 w-full h-1 bg-termo-yellow" />

              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-termo-dark text-white text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="py-4 px-6 w-32">Código</th>
                      <th className="py-4 px-6 w-60">Produto</th>
                      <th className="py-4 px-6 w-36">Categoria</th>
                      <th className="py-4 px-6">Aplicação / Veículos</th>
                      <th className="py-4 px-6 text-right w-28">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredProducts.map((product, idx) => (
                      <tr
                        key={product.id}
                        onClick={() => setSelectedProduct(product)}
                        className={`cursor-pointer hover:bg-termo-yellow/5 transition-colors group ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'
                        }`}
                      >
                        <td className="py-4 px-6 border-r border-gray-100">
                          <span className="inline-block px-3 py-1.5 bg-termo-dark text-termo-yellow border border-termo-dark/20 group-hover:border-termo-yellow group-hover:bg-termo-yellow group-hover:text-termo-dark font-mono font-bold text-xs transition-all whitespace-nowrap">
                            {product.code || 'S/C'}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-gray-800 group-hover:text-termo-dark transition-colors border-r border-gray-100">
                          {product.name}
                        </td>
                        <td className="py-4 px-6 text-xs text-gray-500 font-bold border-r border-gray-100 uppercase tracking-wider">
                          {product.category}
                        </td>
                        <td className="py-4 px-6 text-gray-600 text-xs sm:text-sm leading-relaxed">
                          {product.applied || product.description || (
                            <span className="text-gray-400 italic font-normal">Aplicação sob consulta técnica</span>
                          )}
                        </td>
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 text-xs font-black text-gray-400 group-hover:text-termo-yellow transition-colors uppercase tracking-widest"
                          >
                            <span>Ver</span>
                            <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {selectedProduct && (
          <ApplicationDetailCard
            product={selectedProduct}
            allProducts={products}
            onClose={() => setSelectedProduct(null)}
            onSelectProduct={(p) => setSelectedProduct(p)}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
};

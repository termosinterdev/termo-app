import React, { useState, useMemo, useEffect, useRef } from 'react';
import { fetchProducts, fetchApplications, mapStrapiProduct, StrapiApplication } from '../api';
import { Product, ApplicationItem } from '../types';
import { DimensionCard, DIMENSION_LABELS, getFullProductCode } from '../components/DimensionCard';
import { ApplicationDetailCard } from '../components/ApplicationDetailCard';
import { ProductQuickViewModal } from '../components/ProductQuickViewModal';
import { 
  Search, 
  Ruler, 
  Car, 
  Tag, 
  RotateCcw, 
  Loader2, 
  ChevronRight, 
  ChevronLeft,
  ChevronsLeft,
  ChevronsRight,
  SlidersHorizontal,
  Table as TableIcon,
  LayoutGrid,
  ChevronDown,
  X,
  Layers
} from 'lucide-react';

interface CatalogProps {
  navigate: (route: string) => void;
}

type CatalogViewMode = 'application' | 'dimensional';

const MAX_METRICS = 4;
const ITEMS_PER_PAGE = 30;

const getDimensionRank = (p: Product): number => {
  const code = (p.code || '').toUpperCase();
  const { tag, fullCode } = getFullProductCode(p.code, p.name);
  const fullUpper = fullCode.toUpperCase();
  if (tag === 'STD' || code.endsWith('-STD') || fullUpper.endsWith('-STD')) return 1;
  const matchX = tag.match(/^([0-9]+)X$/);
  if (matchX) return 10 + parseInt(matchX[1], 10);
  return 100;
};

const getFilterIndex = (p: Product, filterCodes: string[]): number => {
  if (filterCodes.length === 0) return -1;
  const base = (p.codigoligacaoproduto || p.code?.split('-')[0] || '').toLowerCase().trim();
  const code = (p.code || '').toLowerCase().trim();
  for (let i = 0; i < filterCodes.length; i++) {
    const fc = filterCodes[i].toLowerCase().trim();
    if (base === fc || code === fc || code.startsWith(`${fc}-`) || code.startsWith(fc)) {
      return i;
    }
  }
  return 999;
};

const sortCatalogProducts = (list: Product[], filterCodes: string[] = []): Product[] => {
  return [...list].sort((a, b) => {
    if (filterCodes.length > 0) {
      const idxA = getFilterIndex(a, filterCodes);
      const idxB = getFilterIndex(b, filterCodes);
      if (idxA !== idxB) return idxA - idxB;
    }

    const baseA = (a.codigoligacaoproduto || a.code?.split('-')[0] || '').trim();
    const baseB = (b.codigoligacaoproduto || b.code?.split('-')[0] || '').trim();
    const cmpBase = baseA.localeCompare(baseB, undefined, { numeric: true, sensitivity: 'base' });
    if (cmpBase !== 0) return cmpBase;

    return getDimensionRank(a) - getDimensionRank(b);
  });
};

export const Catalog: React.FC<CatalogProps> = ({ navigate }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [rawApplications, setRawApplications] = useState<StrapiApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<CatalogViewMode>('application');

  // Filtros da aba Aplicação
  const [vehicleFilter, setVehicleFilter] = useState('');
  const [montadoraFilter, setMontadoraFilter] = useState('Todas');
  const [marcaFilter, setMarcaFilter] = useState('Todas');

  // Filtros da aba Produtos
  const [codeFilter, setCodeFilter] = useState('');
  const [productCodesFilter, setProductCodesFilter] = useState<string[]>([]);
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>([]);
  const [metricValues, setMetricValues] = useState<Record<string, string>>({});
  const [metricDropdownOpen, setMetricDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const catalogAnchorRef = useRef<HTMLDivElement>(null);

  const [selectedApplication, setSelectedApplication] = useState<ApplicationItem | null>(null);
  const [selectedProductQuickView, setSelectedProductQuickView] = useState<Product | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

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
    const loadAllData = async () => {
      setLoading(true);
      try {
        const [strapiProds, strapiApps] = await Promise.all([
          fetchProducts(),
          fetchApplications()
        ]);
        const mapped = strapiProds.map(mapStrapiProduct);
        const sorted = sortCatalogProducts(mapped);
        setProducts(sorted);
        setRawApplications(strapiApps);
      } catch (err) {
        console.error('Erro ao carregar dados do catálogo:', err);
      } finally {
        setLoading(false);
      }
    };
    loadAllData();
  }, []);

  // Agrupamento das aplicações únicas da tabela aplicacoes
  const uniqueApplications = useMemo<ApplicationItem[]>(() => {
    const map = new Map<string, ApplicationItem>();

    rawApplications.forEach(a => {
      const mont = (a.montadora || '').trim();
      const mar = (a.marca || '').trim();
      const desc = (a.aplicacaocatalogo || '').trim();
      const loc = (a.localaplicacao || '').trim();

      const key = `${mont.toUpperCase()}|${mar.toUpperCase()}|${desc.toLowerCase()}|${loc}`;

      if (!map.has(key)) {
        const pieceCodesSet = new Set<string>();
        if (a.itemmotriz?.trim()) pieceCodesSet.add(a.itemmotriz.trim());
        if (a.itemcoletor?.trim()) pieceCodesSet.add(a.itemcoletor.trim());
        if (a.itemintermediario1?.trim()) pieceCodesSet.add(a.itemintermediario1.trim());
        if (a.itemintermediario2?.trim()) pieceCodesSet.add(a.itemintermediario2.trim());
        if (a.itemintermediario3?.trim()) pieceCodesSet.add(a.itemintermediario3.trim());
        if (loc) {
          loc.split('-').forEach(part => {
            const p = part.trim();
            if (p && /^[0-9A-Za-z]+$/.test(p)) pieceCodesSet.add(p);
          });
        }
        if (a.codigoligacaoproduto?.trim()) {
          pieceCodesSet.add(a.codigoligacaoproduto.trim());
        }

        map.set(key, {
          id: a.id || key,
          montadora: mont,
          marca: mar,
          aplicacaocatalogo: desc,
          localaplicacao: loc,
          itemmotriz: a.itemmotriz?.trim() || '',
          itemcoletor: a.itemcoletor?.trim() || '',
          itemintermediario1: a.itemintermediario1?.trim() || '',
          itemintermediario2: a.itemintermediario2?.trim() || '',
          itemintermediario3: a.itemintermediario3?.trim() || '',
          pieceCodes: Array.from(pieceCodesSet)
        });
      } else {
        const item = map.get(key)!;
        if (a.codigoligacaoproduto?.trim() && !item.pieceCodes.includes(a.codigoligacaoproduto.trim())) {
          item.pieceCodes.push(a.codigoligacaoproduto.trim());
        }
      }
    });

    return Array.from(map.values()).sort((a, b) => {
      const cmpMont = a.montadora.localeCompare(b.montadora);
      if (cmpMont !== 0) return cmpMont;
      const cmpMar = a.marca.localeCompare(b.marca);
      if (cmpMar !== 0) return cmpMar;
      return a.aplicacaocatalogo.localeCompare(b.aplicacaocatalogo);
    });
  }, [rawApplications]);

  // Montadoras e Marcas para os filtros da aba Aplicação
  const montadoras = useMemo(() => {
    return ['Todas', ...Array.from(new Set(uniqueApplications.map(a => a.montadora).filter(Boolean))).sort()];
  }, [uniqueApplications]);

  const marcas = useMemo(() => {
    return ['Todas', ...Array.from(new Set(uniqueApplications.map(a => a.marca).filter(Boolean))).sort()];
  }, [uniqueApplications]);

  // Filtro da aba Aplicações
  const filteredApplications = useMemo(() => {
    return uniqueApplications.filter(app => {
      if (vehicleFilter.trim()) {
        const q = vehicleFilter.toLowerCase().trim();
        const matchDesc = app.aplicacaocatalogo.toLowerCase().includes(q);
        const matchMont = app.montadora.toLowerCase().includes(q);
        const matchMarca = app.marca.toLowerCase().includes(q);
        if (!matchDesc && !matchMont && !matchMarca) return false;
      }

      if (montadoraFilter !== 'Todas' && app.montadora !== montadoraFilter) {
        return false;
      }

      if (marcaFilter !== 'Todas' && app.marca !== marcaFilter) {
        return false;
      }

      return true;
    });
  }, [uniqueApplications, vehicleFilter, montadoraFilter, marcaFilter]);

  // Filtro da aba Produtos (Dimensional)
  const filteredProducts = useMemo(() => {
    const list = products.filter(product => {
      // Se houver filtro de peças ativado pelo modal de aplicação
      if (productCodesFilter.length > 0) {
        const matchAny = productCodesFilter.some(pc => {
          const cleanPc = pc.toLowerCase().trim();
          if (product.codigoligacaoproduto && product.codigoligacaoproduto.toLowerCase().trim() === cleanPc) return true;
          if (product.code) {
            const c = product.code.toLowerCase().trim();
            return c === cleanPc || c.startsWith(`${cleanPc}-`) || c.startsWith(cleanPc);
          }
          return false;
        });
        if (!matchAny) return false;
      }

      if (codeFilter.trim()) {
        const query = codeFilter.toLowerCase().trim();
        const codeMatch = product.code?.toLowerCase().includes(query) || false;
        const nameMatch = product.name?.toLowerCase().includes(query) || false;
        if (!codeMatch && !nameMatch) return false;
      }

      for (const metricKey of selectedMetrics) {
        const query = (metricValues[metricKey] || '').trim();
        if (!query) continue;
        const val = (product as any)[metricKey]
          || (product.dimensions && (product.dimensions as any)[metricKey])
          || (product.specs && (product.specs as any)[metricKey]);
        if (!val || !String(val).toLowerCase().includes(query.toLowerCase())) return false;
      }

      return true;
    });

    return sortCatalogProducts(list, productCodesFilter);
  }, [products, codeFilter, selectedMetrics, metricValues, productCodesFilter]);

  // Resetar paginação ao alterar qualquer filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [codeFilter, vehicleFilter, montadoraFilter, marcaFilter, selectedMetrics, metricValues, productCodesFilter, viewMode]);

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

  const hasActiveFilters = Boolean(
    vehicleFilter.trim() || montadoraFilter !== 'Todas' || marcaFilter !== 'Todas'
    || codeFilter.trim() || productCodesFilter.length > 0 || selectedMetrics.some(k => metricValues[k]?.trim())
  );

  const handleResetFilters = () => {
    setVehicleFilter('');
    setMontadoraFilter('Todas');
    setMarcaFilter('Todas');
    setCodeFilter('');
    setProductCodesFilter([]);
    setSelectedMetrics([]);
    setMetricValues({});
    setCurrentPage(1);
  };

  // Ao clicar em "Ver todas as variantes na aba de produtos" dentro do modal da aplicação
  const handleViewInProducts = (pieceCodes: string[]) => {
    setSelectedApplication(null);
    setViewMode('dimensional');
    setProductCodesFilter(pieceCodes);
    setCodeFilter('');
    setCurrentPage(1);

    // Scroll seguro e controlado até o topo do catálogo (evita rolar para o rodapé da página)
    setTimeout(() => {
      if (catalogAnchorRef.current) {
        catalogAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 340, behavior: 'smooth' });
      }
    }, 60);
  };

  // Paginação
  const currentTotal = viewMode === 'application' ? filteredApplications.length : filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(currentTotal / ITEMS_PER_PAGE));

  const paginatedApplications = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredApplications.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredApplications, currentPage]);

  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage]);

  const inputCls = "w-full pl-9 pr-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow/30 transition-all";
  const labelCls = "flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-widest text-gray-500 mb-1.5";

  // Gerador de botões numéricos da paginação
  const renderPaginationButtons = () => {
    const buttons: (number | string)[] = [];
    if (totalPages <= 7) {
      for (let i = 1; i <= totalPages; i++) buttons.push(i);
    } else {
      buttons.push(1);
      if (currentPage > 3) buttons.push('...');
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) buttons.push(i);
      if (currentPage < totalPages - 2) buttons.push('...');
      buttons.push(totalPages);
    }

    const scrollToAnchor = () => {
      if (catalogAnchorRef.current) {
        catalogAnchorRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };

    return (
      <div className="flex items-center gap-1">
        <button
          onClick={() => { setCurrentPage(1); scrollToAnchor(); }}
          disabled={currentPage === 1}
          className="p-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          title="Primeira página"
        >
          <ChevronsLeft size={14} />
        </button>
        <button
          onClick={() => { setCurrentPage(p => Math.max(1, p - 1)); scrollToAnchor(); }}
          disabled={currentPage === 1}
          className="p-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          title="Página anterior"
        >
          <ChevronLeft size={14} />
        </button>

        {buttons.map((btn, idx) => {
          if (btn === '...') {
            return (
              <span key={`dots-${idx}`} className="px-2 py-1 text-xs text-gray-400 select-none">
                ...
              </span>
            );
          }
          const pageNum = btn as number;
          const isActive = pageNum === currentPage;
          return (
            <button
              key={pageNum}
              onClick={() => { setCurrentPage(pageNum); scrollToAnchor(); }}
              className={`min-w-[34px] h-[34px] px-2 text-xs font-bold transition-all border ${
                isActive
                  ? 'bg-termo-yellow text-termo-dark border-termo-yellow shadow-sm font-black'
                  : 'bg-white text-gray-700 border-gray-200 hover:border-termo-yellow hover:text-termo-dark'
              }`}
            >
              {pageNum}
            </button>
          );
        })}

        <button
          onClick={() => { setCurrentPage(p => Math.min(totalPages, p + 1)); scrollToAnchor(); }}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          title="Próxima página"
        >
          <ChevronRight size={14} />
        </button>
        <button
          onClick={() => { setCurrentPage(totalPages); scrollToAnchor(); }}
          disabled={currentPage === totalPages}
          className="p-2 border border-gray-200 bg-white text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed text-xs transition-colors"
          title="Última página"
        >
          <ChevronsRight size={14} />
        </button>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      {/* Header Full-Width Banner */}
      <div className="bg-[#0f0f0f] relative overflow-hidden pt-32 pb-16 mb-0 border-b-4 border-termo-yellow">
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
            Consulte nossa linha sinterizada por aplicação automotiva (montadora, marca e veículo) ou localize produtos diretamente por cotas dimensionais.
          </p>
        </div>
      </div>

      {/* Content area */}
      <div className="container mx-auto px-4 sm:px-6 py-10" ref={catalogAnchorRef}>

        {/* 1. TABS DE SELEÇÃO APLICAÇÃO / PRODUTOS E NÚMERO DE DADOS */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex w-full sm:w-auto bg-white border border-gray-200 overflow-hidden shadow-sm">
            <button
              onClick={() => { setViewMode('application'); setCurrentPage(1); }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 text-sm font-black tracking-wider uppercase transition-all duration-200 ${
                viewMode === 'application'
                  ? 'bg-termo-yellow text-termo-dark'
                  : 'text-gray-500 hover:text-termo-dark hover:bg-gray-50'
              }`}
            >
              <TableIcon size={16} />
              <span>Aplicações</span>
            </button>
            <button
              onClick={() => { setViewMode('dimensional'); setCurrentPage(1); }}
              className={`flex-1 sm:flex-none flex items-center justify-center gap-2.5 px-8 py-3 text-sm font-black tracking-wider uppercase transition-all duration-200 ${
                viewMode === 'dimensional'
                  ? 'bg-termo-yellow text-termo-dark'
                  : 'text-gray-500 hover:text-termo-dark hover:bg-gray-50'
              }`}
            >
              <LayoutGrid size={16} />
              <span>Produtos</span>
            </button>
          </div>
          <div className="text-xs font-mono text-gray-500 flex items-center gap-2 bg-white px-4 py-2 border border-gray-200 shadow-sm">
            <span className="w-2 h-2 rounded-full bg-termo-yellow animate-pulse"></span>
            <strong className="text-termo-dark">{currentTotal}</strong>{' '}
            {viewMode === 'application' 
              ? (currentTotal === 1 ? 'aplicação' : 'aplicações') 
              : (currentTotal === 1 ? 'produto' : 'produtos')}
          </div>
        </div>

        {/* 2. TÍTULO */}
        <div className="mb-6">
          {viewMode === 'application' ? (
            <div>
              <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-[10px] block mb-1">
                Pesquisa por montadora, marca e veículo
              </span>
              <h2 className="text-3xl font-display font-black text-termo-dark flex items-center gap-3">
                <Car size={24} className="text-termo-yellow flex-shrink-0" />
                Catálogo de Aplicação
              </h2>
            </div>
          ) : (
            <div>
              <span className="text-termo-yellow font-mono font-bold uppercase tracking-[0.4em] text-[10px] block mb-1">
                Pesquisa por medidas e cotas técnicas
              </span>
              <h2 className="text-3xl font-display font-black text-termo-dark flex items-center gap-3">
                <Ruler size={24} className="text-termo-yellow flex-shrink-0" />
                Catálogo de Produtos
              </h2>
            </div>
          )}
        </div>

        {/* 3. CONTAINER DE PESQUISA (FILTROS) */}
        <div className="bg-white border border-gray-200 shadow-sm mb-8 relative z-20">
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
            {viewMode === 'application' ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Veículo / Aplicação */}
                <div className="md:col-span-1">
                  <label className={labelCls}>
                    <Car size={11} className="text-termo-yellow" />
                    Veículo / Aplicação
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: Gol, Uno, Scania, Motor AP..."
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

                {/* Montadora */}
                <div>
                  <label className={labelCls}>
                    Montadora
                  </label>
                  <select
                    value={montadoraFilter}
                    onChange={(e) => setMontadoraFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow/30 transition-all cursor-pointer"
                  >
                    {montadoras.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>

                {/* Marca */}
                <div>
                  <label className={labelCls}>
                    Marca / Sistema
                  </label>
                  <select
                    value={marcaFilter}
                    onChange={(e) => setMarcaFilter(e.target.value)}
                    className="w-full px-3 py-2.5 bg-white border border-gray-200 text-sm text-gray-800 focus:outline-none focus:border-termo-yellow focus:ring-1 focus:ring-termo-yellow/30 transition-all cursor-pointer"
                  >
                    {marcas.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Código do Produto */}
                <div className="md:col-span-1">
                  <label className={labelCls}>
                    <Tag size={11} className="text-termo-yellow" />
                    Código do Produto
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Ex: 1026-STD, 1724-2X..."
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

                {/* Dimensional: seletor de métricas */}
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
              </div>
            )}

            {/* Chips de filtros ativos */}
            {hasActiveFilters && (
              <div className="flex flex-wrap gap-2 pt-2 border-t border-gray-200">
                <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider self-center mr-1">Ativos:</span>
                
                {productCodesFilter.length > 0 && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-termo-yellow text-termo-dark text-xs font-black border border-termo-yellow shadow-sm rounded">
                    <Layers size={11} />
                    {productCodesFilter.length === 1
                      ? 'Item selecionado da aplicação'
                      : `Itens da aplicação selecionada (${productCodesFilter.length} itens)`}
                    <button onClick={() => setProductCodesFilter([])} className="ml-1 hover:text-red-700" title="Remover filtro de itens"><X size={12}/></button>
                  </span>
                )}

                {vehicleFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-termo-dark text-termo-yellow text-xs font-bold border border-termo-yellow/30">
                    <Car size={10} /> {vehicleFilter}
                    <button onClick={() => setVehicleFilter('')} className="ml-1 hover:text-white"><X size={12}/></button>
                  </span>
                )}

                {montadoraFilter !== 'Todas' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 rounded">
                    Montadora: {montadoraFilter}
                    <button onClick={() => setMontadoraFilter('Todas')} className="ml-1 hover:text-termo-yellow"><X size={12}/></button>
                  </span>
                )}

                {marcaFilter !== 'Todas' && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 text-gray-700 text-xs font-bold border border-gray-200 rounded">
                    Marca: {marcaFilter}
                    <button onClick={() => setMarcaFilter('Todas')} className="ml-1 hover:text-termo-yellow"><X size={12}/></button>
                  </span>
                )}

                {codeFilter && (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-termo-dark text-termo-yellow text-xs font-mono font-bold border border-termo-yellow/30">
                    <Tag size={10} /> {codeFilter}
                    <button onClick={() => setCodeFilter('')} className="ml-1 hover:text-white"><X size={12}/></button>
                  </span>
                )}
              </div>
            )}

            {/* Inputs por métrica (dimensional) */}
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

        {/* 4. TABELA / GRID DE RESULTADOS */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-24 bg-white border border-gray-200 shadow-sm mt-8">
            <Loader2 size={44} className="text-termo-yellow animate-spin mb-4" />
            <h3 className="text-lg font-black text-gray-500 uppercase tracking-widest text-sm">Carregando catálogo...</h3>
          </div>
        ) : currentTotal === 0 ? (
          <div className="text-center py-24 bg-white border border-gray-200 shadow-sm p-8 mt-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-32 h-32 bg-gray-50 rotate-45 transform translate-x-16 -translate-y-16" />
            <div className="inline-block p-6 bg-gray-50 border border-gray-100 mb-6 relative z-10">
              <Search size={40} className="text-gray-400" />
            </div>
            <h3 className="text-3xl font-display font-black text-termo-dark mb-4 tracking-wide">NENHUM RESULTADO ENCONTRADO</h3>
            <p className="text-gray-500 text-sm max-w-md mx-auto mb-8 leading-relaxed">
              Não encontramos resultados com os filtros informados. Tente ajustar o veículo, montadora ou marca pesquisada.
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
        ) : viewMode === 'application' ? (

          /* CATÁLOGO DE APLICAÇÃO (TABELA) */
          <div>
            <div className="bg-white border border-gray-200 overflow-hidden shadow-sm relative">
              <div className="absolute top-0 left-0 w-full h-1 bg-termo-yellow" />
              {/* Gradiente indicador de scroll horizontal em mobile */}
              <div className="absolute right-0 top-0 bottom-0 w-8 bg-gradient-to-l from-white/80 to-transparent z-10 pointer-events-none sm:hidden" />

              <div className="overflow-x-auto pt-1">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-termo-dark text-white text-[10px] font-black uppercase tracking-[0.2em]">
                      <th className="py-4 px-6 w-52">Montadora</th>
                      <th className="py-4 px-6 w-44">Marca</th>
                      <th className="py-4 px-6">Veículo / Aplicação</th>
                      <th className="py-4 px-6 text-right w-36">Ação</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {paginatedApplications.map((app, idx) => (
                      <tr
                        key={app.id || idx}
                        onClick={() => setSelectedApplication(app)}
                        className={`cursor-pointer hover:bg-termo-yellow/5 transition-colors group ${
                          idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'
                        }`}
                      >
                        {/* Montadora */}
                        <td className="py-4 px-6 border-r border-gray-100 font-bold text-gray-800">
                          <span className="inline-block px-3 py-1 bg-gray-100 border border-gray-200 group-hover:border-termo-yellow/50 rounded text-xs font-black uppercase tracking-wider text-gray-700 transition-colors">
                            {app.montadora || '—'}
                          </span>
                        </td>

                        {/* Marca */}
                        <td className="py-4 px-6 border-r border-gray-100 font-bold text-gray-700 text-xs uppercase tracking-wider">
                          <span className="font-mono text-termo-dark">
                            {app.marca || '—'}
                          </span>
                        </td>

                        {/* Veículo / Aplicação */}
                        <td className="py-4 px-6 text-gray-800 text-xs sm:text-sm font-medium leading-relaxed">
                          {app.aplicacaocatalogo}
                        </td>

                        {/* Ação */}
                        <td className="py-4 px-6 text-right">
                          <button
                            type="button"
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-gray-100 group-hover:bg-termo-yellow text-gray-700 group-hover:text-termo-dark text-xs font-black uppercase tracking-wider rounded transition-all whitespace-nowrap shadow-sm"
                          >
                            <span>Ver peças</span>
                            <ChevronRight size={14} className="transform group-hover:translate-x-1 transition-transform" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-mono">
                  Exibindo <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> a <strong>{Math.min(currentPage * ITEMS_PER_PAGE, currentTotal)}</strong> de <strong>{currentTotal}</strong> aplicações
                </span>
                {renderPaginationButtons()}
              </div>
            )}
          </div>

        ) : (

          /* CATÁLOGO DE PRODUTOS (GRID) */
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 2xl:grid-cols-4 gap-6">
              {paginatedProducts.map(product => (
                <DimensionCard
                  key={product.id}
                  product={product}
                  navigate={navigate}
                  onOpenDetail={() => setSelectedProductQuickView(product)}
                />
              ))}
            </div>

            {/* Paginação */}
            {totalPages > 1 && (
              <div className="mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 border border-gray-200 shadow-sm">
                <span className="text-xs text-gray-500 font-mono">
                  Exibindo <strong>{(currentPage - 1) * ITEMS_PER_PAGE + 1}</strong> a <strong>{Math.min(currentPage * ITEMS_PER_PAGE, currentTotal)}</strong> de <strong>{currentTotal}</strong> produtos
                </span>
                {renderPaginationButtons()}
              </div>
            )}
          </div>
        )}

        {/* Modal de Detalhamento da Aplicação */}
        {selectedApplication && (
          <ApplicationDetailCard
            application={selectedApplication}
            allProducts={products}
            onClose={() => setSelectedApplication(null)}
            onViewInProducts={handleViewInProducts}
            navigate={navigate}
          />
        )}

        {/* Modal de Detalhamento Rápido do Produto */}
        {selectedProductQuickView && (
          <ProductQuickViewModal
            product={selectedProductQuickView}
            onClose={() => setSelectedProductQuickView(null)}
            navigate={navigate}
          />
        )}
      </div>
    </div>
  );
};

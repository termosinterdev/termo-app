export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

export const FALLBACK_IMAGE = "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='600' height='600' viewBox='0 0 600 600'%3E%3Crect width='600' height='600' fill='%23f3f4f6'/%3E%3Cg transform='translate(300,300)'%3E%3Ccircle r='120' fill='none' stroke='%23d1d5db' stroke-width='8'/%3E%3Ccircle r='45' fill='none' stroke='%23d1d5db' stroke-width='8'/%3E%3Cline x1='0' y1='-45' x2='0' y2='-120' stroke='%23d1d5db' stroke-width='6'/%3E%3Cline x1='45' y1='0' x2='120' y2='0' stroke='%23d1d5db' stroke-width='6'/%3E%3Cline x1='0' y1='45' x2='0' y2='120' stroke='%23d1d5db' stroke-width='6'/%3E%3Cline x1='-45' y1='0' x2='-120' y2='0' stroke='%23d1d5db' stroke-width='6'/%3E%3C/g%3E%3Ctext x='300' y='480' text-anchor='middle' font-family='system-ui,sans-serif' font-size='14' font-weight='600' fill='%239ca3af' letter-spacing='3'%3ESEM IMAGEM%3C/text%3E%3C/svg%3E";

const normalizeDim = (val: any) => {
  if (val === null || val === undefined) return undefined;
  const s = String(val).trim();
  if (!s || s === '0.000' || s === '0' || s === '0.0' || parseFloat(s) === 0) return undefined;
  return s;
};

export const mapStrapiProduct = (sp: StrapiProduct | any) => {
  const rawPictures = Array.isArray(sp.pictures)
    ? sp.pictures
    : (Array.isArray(sp.pictures?.data) ? sp.pictures.data.map((d: any) => d.attributes || d) : []);

  const mappedImages = rawPictures.map((p: any) => {
    const url = p?.url || p?.attributes?.url || '';
    if (!url) return '';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }).filter(Boolean);

  const fallbackCategory = (sp.name || '').toUpperCase().includes('ANEL')
    ? 'Aneis'
    : (sp.name || '').toUpperCase().includes('KIT')
    ? 'Kits'
    : 'Buchas';

  let resolvedMaterial = '';
  if (sp.material && String(sp.material).trim() && String(sp.material).trim().toLowerCase() !== 'diversos') {
    resolvedMaterial = String(sp.material).trim().toUpperCase();
  }
  if (!resolvedMaterial && sp.specs) {
    let s = sp.specs;
    if (typeof s === 'string') {
      try { s = JSON.parse(s); } catch {}
    }
    if (typeof s === 'object' && s !== null) {
      for (const [k, v] of Object.entries(s)) {
        if (/^material/i.test(k.trim()) && v) {
          const val = String(v).trim().toUpperCase();
          resolvedMaterial = val === 'BR' ? 'BRONZE' : val === 'FE' ? 'FERRO' : val;
          break;
        }
      }
    }
  }

  return {
    id: sp.id,
    documentId: sp.documentId,
    code: sp.code,
    name: sp.name,
    category: (sp.category?.name as any) || (sp.category?.data?.attributes?.name as any) || fallbackCategory,
    description: sp.applied || 'Produto com alta durabilidade e precisão dimensional.',
    applied: sp.applied || '',
    material: resolvedMaterial,
    price: sp.price || '',
    specs: sp.specs || {},
    dimensions: sp.dimensions || sp.specs?.dimensions || null,
    dintmin: normalizeDim(sp.dintmin || sp.specs?.dintmin),
    dintmax: normalizeDim(sp.dintmax || sp.specs?.dintmax),
    dextmin: normalizeDim(sp.dextmin || sp.specs?.dextmin),
    dextmax: normalizeDim(sp.dextmax || sp.specs?.dextmax),
    htmin: normalizeDim(sp.htmin || sp.specs?.htmin),
    htmax: normalizeDim(sp.htmax || sp.specs?.htmax),
    dflmin: normalizeDim(sp.dflmin || sp.specs?.dflmin),
    dflmax: normalizeDim(sp.dflmax || sp.specs?.dflmax),
    hflmin: normalizeDim(sp.hflmin || sp.specs?.hflmin),
    hflmax: normalizeDim(sp.hflmax || sp.specs?.hflmax),
    desfmin: normalizeDim(sp.desfmin || sp.specs?.desfmin),
    desfmax: normalizeDim(sp.desfmax || sp.specs?.desfmax),
    dpesmin: normalizeDim(sp.dpesmin || sp.specs?.dpesmin),
    dpesmax: normalizeDim(sp.dpesmax || sp.specs?.dpesmax),
    hpesmin: normalizeDim(sp.hpesmin || sp.specs?.hpesmin),
    hpesmax: normalizeDim(sp.hpesmax || sp.specs?.hpesmax),
    isFavorite: sp.isFavorite ?? sp.isMain ?? false,
    isMain: sp.isFavorite ?? sp.isMain ?? false,
    codigobarra: sp.codigobarra || sp.specs?.codigo_barra || '',
    codigoligacaoproduto: sp.codigoligacaoproduto || sp.specs?.codigo_ligacao || '',
    pesoliquido: sp.pesoliquido || sp.specs?.peso_liquido || '',
    images: mappedImages.length > 0 ? mappedImages : [FALLBACK_IMAGE],
  };
};

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
}

export interface StrapiCategory {
  id: number;
  documentId?: string;
  name: string;
}

export interface StrapiProduct {
  id: number;
  documentId?: string;
  name: string;
  code: string;
  specs: any;
  dimensions?: any;
  dintmin?: string;
  dintmax?: string;
  dextmin?: string;
  dextmax?: string;
  htmin?: string;
  htmax?: string;
  dflmin?: string;
  dflmax?: string;
  hflmin?: string;
  hflmax?: string;
  desfmin?: string;
  desfmax?: string;
  dpesmin?: string;
  dpesmax?: string;
  hpesmin?: string;
  hpesmax?: string;
  applied: string;
  price: string;
  isFavorite?: boolean;
  isMain?: boolean;
  material?: string;
  codigobarra?: string;
  codigoligacaoproduto?: string;
  pesoliquido?: string;
  category?: StrapiCategory;
  pictures?: StrapiImage[];
}

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    }
  }
}

export const fetchProducts = async (): Promise<StrapiProduct[]> => {
  try {
    let allProducts: StrapiProduct[] = [];
    let page = 1;
    let totalPages = 1;
    const pageSize = 500;

    while (page <= totalPages) {
      const response = await fetch(`${STRAPI_URL}/api/produtos?pagination[page]=${page}&pagination[pageSize]=${pageSize}&populate=*`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar produtos: ${response.statusText}`);
      }
      const json: StrapiResponse<StrapiProduct[]> = await response.json();
      if (json.data && Array.isArray(json.data)) {
        allProducts = allProducts.concat(json.data);
      }
      totalPages = json.meta?.pagination?.pageCount || 1;
      page++;
    }

    return allProducts;
  } catch (error) {
    console.error('Erro na API:', error);
    return [];
  }
};

export const fetchFavoriteProducts = async (): Promise<StrapiProduct[]> => {
  try {
    // Tenta buscar filtrando por isFavorite no Strapi
    const response = await fetch(`${STRAPI_URL}/api/produtos?filters[isFavorite][$eq]=true&populate=*`);
    if (response.ok) {
      const json: StrapiResponse<StrapiProduct[]> = await response.json();
      if (json.data && json.data.length > 0) {
        return json.data;
      }
    }
  } catch (err) {
    console.warn('Filtro isFavorite direto na API falhou, tentando fallback:', err);
  }

  // Fallback 1: Buscar todos os produtos e filtrar no frontend (caso o endpoint não aceite o filtro ou campo seja isFavorite / isMain)
  try {
    const allProducts = await fetchProducts();
    const favorites = allProducts.filter(p => p.isFavorite === true || p.isMain === true);
    if (favorites.length > 0) {
      return favorites;
    }
    // Fallback 2: Se nenhum estiver com flag ainda na API de prod, retorna os 3 primeiros para a Home continuar funcionando
    return allProducts.slice(0, 3);
  } catch (error) {
    console.error('Erro ao buscar favoritos:', error);
    return [];
  }
};

export const fetchMainProducts = fetchFavoriteProducts;

export const fetchProductById = async (id: number | string): Promise<StrapiProduct | null> => {
  try {
    const isNum = !isNaN(Number(id));
    if (isNum) {
      const fallbackId = await fetch(`${STRAPI_URL}/api/produtos?filters[id][$eq]=${id}&populate=*`);
      if (fallbackId.ok) {
        const json = await fallbackId.json();
        if (json.data && json.data.length > 0) return json.data[0];
      }
    }
    const response = await fetch(`${STRAPI_URL}/api/produtos/${id}?populate=*`);
    if (response.ok) {
      const json: { data: StrapiProduct } = await response.json();
      if (json.data) return json.data;
    }
    const fallbackCode = await fetch(`${STRAPI_URL}/api/produtos?filters[code][$eq]=${id}&populate=*`);
    if (fallbackCode.ok) {
      const json = await fallbackCode.json();
      if (json.data && json.data.length > 0) return json.data[0];
    }
    return null;
  } catch (error) {
    console.error('Erro na API:', error);
    return null;
  }
};

export interface StrapiApplication {
  id: number;
  documentId?: string;
  montadora: string;
  marca: string;
  aplicacaocatalogo: string;
  localaplicacao?: string;
  itemmotriz?: string;
  itemcoletor?: string;
  itemintermediario1?: string;
  itemintermediario2?: string;
  itemintermediario3?: string;
  codigoligacaoproduto?: string;
}

export const fetchApplications = async (): Promise<StrapiApplication[]> => {
  try {
    let allApps: StrapiApplication[] = [];
    let page = 1;
    let totalPages = 1;
    const pageSize = 1000;

    while (page <= totalPages) {
      const response = await fetch(`${STRAPI_URL}/api/aplicacoes?pagination[page]=${page}&pagination[pageSize]=${pageSize}`);
      if (!response.ok) {
        throw new Error(`Erro ao buscar aplicações: ${response.statusText}`);
      }
      const json: StrapiResponse<StrapiApplication[]> = await response.json();
      if (json.data && Array.isArray(json.data)) {
        allApps = allApps.concat(json.data);
      }
      totalPages = json.meta?.pagination?.pageCount || 1;
      page++;
    }

    return allApps;
  } catch (error) {
    console.error('Erro ao buscar aplicações:', error);
    return [];
  }
};

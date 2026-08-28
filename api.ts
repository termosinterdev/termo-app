export const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

const FALLBACK_IMAGE = 'https://photos.fife.usercontent.google.com/pw/AP1GczPJr5V3GrUkjs2zfKjIEAmbu6unLpZmmiZG20QJik8Puo9p7yJWds2osw=w578-h586-s-no-gm?authuser=0';

export const mapStrapiProduct = (sp: StrapiProduct | any) => {
  const rawPictures = Array.isArray(sp.pictures)
    ? sp.pictures
    : (Array.isArray(sp.pictures?.data) ? sp.pictures.data.map((d: any) => d.attributes || d) : []);

  const mappedImages = rawPictures.map((p: any) => {
    const url = p?.url || p?.attributes?.url || '';
    if (!url) return '';
    return url.startsWith('http') ? url : `${STRAPI_URL}${url}`;
  }).filter(Boolean);

  return {
    id: sp.id,
    code: sp.code,
    name: sp.name,
    category: (sp.category?.name as any) || (sp.category?.data?.attributes?.name as any) || 'Outros',
    description: sp.applied || 'Produto com alta durabilidade e precisão.',
    applied: sp.applied || '',
    material: sp.specs?.material || 'Diversos',
    price: sp.price || '',
    specs: sp.specs || {},
    dimensions: sp.dimensions || sp.specs?.dimensions || null,
    dintmin: sp.dintmin || sp.specs?.dintmin,
    dintmax: sp.dintmax || sp.specs?.dintmax,
    dextmin: sp.dextmin || sp.specs?.dextmin,
    dextmax: sp.dextmax || sp.specs?.dextmax,
    htmin: sp.htmin || sp.specs?.htmin,
    htmax: sp.htmax || sp.specs?.htmax,
    dflmin: sp.dflmin || sp.specs?.dflmin,
    dflmax: sp.dflmax || sp.specs?.dflmax,
    hflmin: sp.hflmin || sp.specs?.hflmin,
    hflmax: sp.hflmax || sp.specs?.hflmax,
    desfmin: sp.desfmin || sp.specs?.desfmin,
    desfmax: sp.desfmax || sp.specs?.desfmax,
    dpesmin: sp.dpesmin || sp.specs?.dpesmin,
    dpesmax: sp.dpesmax || sp.specs?.dpesmax,
    hpesmin: sp.hpesmin || sp.specs?.hpesmin,
    hpesmax: sp.hpesmax || sp.specs?.hpesmax,
    isFavorite: sp.isFavorite ?? sp.isMain ?? false,
    isMain: sp.isFavorite ?? sp.isMain ?? false,
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
    const response = await fetch(`${STRAPI_URL}/api/produtos?populate=*`);
    if (!response.ok) {
      throw new Error('Erro ao buscar produtos');
    }
    const json: StrapiResponse<StrapiProduct[]> = await response.json();
    return json.data || [];
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



export const fetchProductById = async (id: number): Promise<StrapiProduct | null> => {
  try {
    const response = await fetch(`${STRAPI_URL}/api/produtos/${id}?populate=*`);
    if (!response.ok) {
      throw new Error('Erro ao buscar produto');
    }
    const json: { data: StrapiProduct } = await response.json();
    return json.data;
  } catch (error) {
    console.error('Erro na API:', error);
    return null;
  }
};

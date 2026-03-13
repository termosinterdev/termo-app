const STRAPI_URL = import.meta.env.VITE_STRAPI_URL || 'http://localhost:1337';

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
  applied: string;
  price: string;
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
    return json.data;
  } catch (error) {
    console.error('Erro na API:', error);
    return [];
  }
};

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

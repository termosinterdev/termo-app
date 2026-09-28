export interface ProductDimensions {
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
  [key: string]: any;
}

export interface Product {
  id: number;
  documentId?: string;
  name: string;
  category: string;
  description: string;
  material: string;
  price: string;
  images: string[];
  specs?: any;
  dimensions?: ProductDimensions;
  // Campos de dimensões diretos
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
  code?: string;
  isFavorite?: boolean;
  isMain?: boolean;
  applied?: string;
  codigobarra?: string;
  codigoligacaoproduto?: string;
  pesoliquido?: string;
}

export interface ApplicationItem {
  id: number | string;
  montadora: string;
  marca: string;
  aplicacaocatalogo: string;
  localaplicacao: string;
  itemmotriz?: string;
  itemcoletor?: string;
  itemintermediario1?: string;
  itemintermediario2?: string;
  itemintermediario3?: string;
  pieceCodes: string[];
}

export interface Service {
  id: number;
  title: string;
  description: string;
  iconName: string;
}

export enum PageRoute {
  HOME = '/',
  CATALOG = '/catalogo',
  ABOUT = '/sobre',
  ADMIN = '/admin',
  CONTACT = '/contato'
}
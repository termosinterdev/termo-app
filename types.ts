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
  name: string;
  category: 'Buchas' | 'Engrenagens' | 'Estruturais' | 'Filtros' | 'Outros';
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
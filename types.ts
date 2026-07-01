export interface Product {
  id: number;
  name: string;
  category: 'Buchas' | 'Engrenagens' | 'Estruturais' | 'Filtros' | 'Outros';
  description: string;
  material: string;
  price: string;
  images: string[];
  specs?: any;
  code?: string;
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
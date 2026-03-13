import { Product, Service } from './types';

export const MOCK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: "Bucha Flangeada Industrial",
    category: "Buchas",
    description: "Componente com flange para suporte de cargas axiais. Alta resistência ao desgaste e baixo coeficiente de atrito.",
    material: "Ferro Sinterizado (F-0000)",
    price: "R$ 18,90",
    images: [
      "https://images.unsplash.com/photo-1519752594763-2633d8d4ea29?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1736161999180-abe68e57304c?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
      "https://images.unsplash.com/photo-1666172155681-ea3a666d3c52?q=80&w=1374&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
    ]
  },
  {
    id: 2,
    name: "Filtro Bronze Poroso Disco",
    category: "Filtros",
    description: "Disco filtrante para retenção de partículas em linhas de gás e líquidos. Porosidade controlada.",
    material: "Bronze Esférico",
    price: "R$ 8,50",
    images: [
      "https://cdn-aghol.nitrocdn.com/UvBskAltloJhrufKVvgVxlxPWUwuqHGq/assets/images/optimized/rev-fc5f825/www.saifilter.com/wp-content/uploads/2023/11/Sintered-Porous-Bronze-Fuel-Filter.png",
      "https://pt.pmbushing.com/uploads/202325624/sintered-porous-metal-bronze-powder-filterd1fe9b74-0fc4-4949-9706-11072a326962.jpg",
      "https://powdermetallurgy.com/wp-content/uploads/2024/10/bronze-filter-3.jpg"
    ]
  }
];

export const SERVICES: Service[] = [
  {
    id: 1,
    title: "Sinterização de Precisão",
    description: "Controle rigoroso de temperatura e atmosfera para garantir propriedades mecânicas superiores.",
    iconName: "Flame"
  },
  {
    id: 2,
    title: "Ferramentaria Própria",
    description: "Desenvolvimento e manutenção ágil de moldes e compactadores.",
    iconName: "Wrench"
  },
  {
    id: 3,
    title: "Usinagem Complementar",
    description: "Acabamentos precisos que vão além das capacidades da compactação padrão.",
    iconName: "Settings"
  },
  {
    id: 4,
    title: "Engenharia de Materiais",
    description: "Consultoria para seleção da melhor liga metálica para sua aplicação.",
    iconName: "Microscope"
  }
];

export interface ServiceItem {
  id: string;
  name: string;
  category: ServiceCategory;
  price: number;
  duration: number; // in minutes
  description: string;
}

export enum ServiceCategory {
  HANDS = 'Chăm sóc tay',
  FEET = 'Chăm sóc chân',
  NAIL_ART = 'Nail Art',
  EXTENSIONS = 'Nối móng',
  SPA = 'Spa thư giãn'
}

export interface SearchState {
  query: string;
  isAiSearch: boolean;
  isLoading: boolean;
  results: ServiceItem[];
}
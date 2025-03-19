export interface Product {
  id: number;
  name: string;
  description: string;
  imageName: string[];
  averageRating: number;
  ratingCount: number;
  specialOfferIds: number[];
  itemType: string;
  options: Option[];
  color?: '';
}

export interface Option {
  id?: number;
  quantity: number;
  volume?: number;
  price: number;
  measureValue?: number;
}

export interface ApiResponse {
  content: Product[];
  totalElements: number;
  totalPages: number;
}
export interface Cider extends Product {
  ciderName: string;
  ciderImageName: string;
  cidreColor: string;
}
export interface Beer extends Product {
  beerName: string;
  beerColor: string;
  beerImageName: string;
}
export interface Snack extends Product {
  snackName: string;
  snackImageName: string;
  beerColor: string;
  options: SnackOptions[];
}
export interface SnackOptions extends Option {
  weight: number;
}

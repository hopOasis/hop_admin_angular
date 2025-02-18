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
}
  
export interface Option {
    id: number;
    measureValue: number;
    quantity: number;
    price: number;
}
  
export interface ApiResponse {
    content: Product[];
    totalElements: number;
    totalPages: number; 
  }
  
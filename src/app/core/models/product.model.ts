export interface Product {
    id: number;
    name: string;
    ciderName: string;
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
    quantity: number;
    volume: number;
    price: number;
    measureValue?: number;
}
  
export interface ApiResponse {
    content: Product[];
    totalElements: number;
    totalPages: number; 
}
export interface Cider extends Product{
    ciderName: string
    ciderImageName: string
}
export interface Beer extends Product{
    beerName: string
    beerImageName: string
}
export interface Snack extends Product{
    snackName: string
    snackImageName: string
    options: SnackOptions[]
}
export interface SnackOptions extends Option{
    weight: number,
}
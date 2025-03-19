export interface Order {
    id: number;
    customerPhoneNumber: string;
    paymentType: string;
    deliveryMethod: string;
    deliveryAddress: string;
    deliveryStatus: string;
    pendingStatus?: string | null;
}
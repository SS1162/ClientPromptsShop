import { AddToCartModel } from "./AddToCartModel";


export class OrderDetailsModel {
    orderId!: number;
    userId!: number;     
    reviewId?: number;
    reviewImg?: string;
    stars?: number;       
    siteName!: string;
    siteTypeName?: string;
    siteTypeDescription?: string;
    products!: AddToCartModel[]; 
    Prompt?:string
}
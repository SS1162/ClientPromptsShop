import { OrderItemModel } from "./OrderItemModel";


export class OrderDetailsModel {
    orderID!: number;
    userId!: number;
    reviewId?: number;
    reviewImg?: string;
    stars?: number;
    siteName!: string;
    siteTypeName?: string;
    siteTypeDescription?: string;
    products!: OrderItemModel[];
    Prompt?: string;
}
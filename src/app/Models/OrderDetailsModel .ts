import { OrderItemModel } from "./OrderItemModel";


export class OrderDetailsModel {
    orderID!: number;
    userId!: number;
    reviewId?: number;
    reviewImg?: string;
    stars?: number;
    note?: string;
    Note?: string;
    siteName!: string;
    siteTypeName?: string;
    siteTypeDescription?: string;
    products!: OrderItemModel[];
    prompt?: string;
}
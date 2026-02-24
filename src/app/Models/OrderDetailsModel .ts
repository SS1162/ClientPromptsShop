import { OrderItemModel } from "./OrderItemModel";


export class OrderDetailsModel {
    orderID!: number;
    userID!: number;
    reviewId?: number;
    reviewImg?: string | null;
    stars?: number;
    reviewNote?: string;
    siteName!: string;
    siteTypeName?: string;
    siteTypeDescreption?: string;
    products!: OrderItemModel[];
    prompt?: string | null;
}
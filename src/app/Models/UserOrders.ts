export class UserOrdersModel {
    userID!: number
    orderID!: number
    orderDate!: Date | string 
    orderSum!: number          
    siteName!: string
    siteTypeName!: string
    siteTypeDescreption!: string 
    statusName!: string
    platformName!: string
    lenOrderItems!: number
    reviewID?: string
    stars?: number
    reviewImg?: string
}
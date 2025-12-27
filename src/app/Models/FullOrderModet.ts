import { AddToCartModel } from "./AddToCartModel"


export class FullOrderModel{
    orderID!: number
    userID!: number
    orderSum!: number
    basicID!: number
    status!: number
    products!: AddToCartModel[]
}
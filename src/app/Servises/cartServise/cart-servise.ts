import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CartItemModel } from '../../Models/CartItemModel';
import { catchError, EMPTY, Observable, switchMap, tap } from 'rxjs';
import { AddToCartModel } from '../../Models/AddToCartModel';

@Injectable({
  providedIn: 'root',
})
export class CartServise {
  http: HttpClient = inject(HttpClient);
  BASIC_URL: string = `${environment.apiUrl}/CartsItems`;
  private cartItemsSubject = new BehaviorSubject<CartItemModel[] | null>(null)
  public cartItems$: Observable<CartItemModel[] | null> = this.cartItemsSubject.asObservable()
  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null)
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable()

  getUserCart(userId: number) {


    this.http.get<CartItemModel[]>(`${this.BASIC_URL}?userId=${userId}`, { observe: 'response' }).subscribe({
      next: (data) => {
       // this.cartItemsSubject.next(data.body)
        this.errorSubject.next(null)
        this.cartItemsSubject.next(
       [
    {
        cartID: 10,
        productID: 101,
        productsName: "מקלדת מכנית RGB",
        price: 450,
        categoryName: "ציוד היקפי",
        imgUrl: "https://images.unsplash.com/photo-1511467687858-23d96c32e4ae?auto=format&fit=crop&w=600&q=80",
        categoryDescreption: "ציוד קצה למחשב",
        valid: 1,
        userDescription: "סוויצ'ים אדומים, שקטה במיוחד",
        platformName: "Windows/Mac"
    },
    {
        cartID: 11,
        productID: 102,
        productsName: "עכבר גיימינג אלחוטי",
        price: 299,
        categoryName: "ציוד היקפי",
        imgUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        categoryDescreption: "ציוד קצה למחשב",
        valid: 1,
        platformName: "Universal"
    },
    {
        cartID: 12,
        productID: 103,
        productsName: "מסך קעור 32 אינץ'",
        price: 1850,
        categoryName: "מסכים",
        imgUrl: "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?auto=format&fit=crop&w=600&q=80",
        categoryDescreption: "מסכי תצוגה ברזולוציה גבוהה",
        valid: 1,
        userDescription: "קצב רענון 144Hz",
        platformName: "PC/Console"
    },
    {
        cartID: 13,
        productID: 100,
        productsName: "אוזניות סטודיו",
        price: 620,
        categoryName: "אודיו",
        imgUrl: "https://images.unsplash.com/photo-1546435770-a3e426da473b?auto=format&fit=crop&w=600&q=80",
        categoryDescreption: "ציוד שמע מקצועי",
        valid: 0,
        platformName: "Audio Interface"
    }
])
      },
      error: (err) => {
        this.errorSubject.next(err)
      }
    })
  }


addCartItem(cartItem:AddToCartModel){
this.http.post<AddToCartModel>(this.BASIC_URL,cartItem)

}
removeCartItem(cartId:number,userId:number){
     this.http.delete<void>(`${this.BASIC_URL}/${cartId}`).pipe(catchError(error=>{
    this.errorSubject.next(error)
    return EMPTY
  }),tap(()=>{
    this.getUserCart(userId)
  }))
}
changeProductToInValid(cartId:number,userId:number){
   this.http.put<void>(`${this.BASIC_URL}/changeToNotValid/${cartId}`,null).pipe(catchError(error=>{
    this.errorSubject.next(error)
    return EMPTY
  }),tap(()=>{
    this.getUserCart(userId)
  }))
}
changeProductToValid(cartId:number,userId:number){

  this.http.put<void>(`${this.BASIC_URL}/changeToValid/${cartId}`,null).pipe(catchError(error=>{
    this.errorSubject.next(error)
    return EMPTY
  }),tap(()=>{
    this.getUserCart(userId)
  }))
}

}

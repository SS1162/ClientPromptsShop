import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CartItemModel } from '../../Models/CartItemModel';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { AddToCartModel } from '../../Models/AddToCartModel';

@Injectable({
  providedIn: 'root',
})
export class CartServise {
  http: HttpClient = inject(HttpClient);
  BASIC_URL: string = `${environment.apiUrl}/CartsItems`;

  private cartItemsSubject = new BehaviorSubject<CartItemModel[] | null>(null);
  public cartItems$: Observable<CartItemModel[] | null> = this.cartItemsSubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable();

  private popupOpenSubject = new BehaviorSubject<boolean>(false);
  public popupOpen$: Observable<boolean> = this.popupOpenSubject.asObservable();

  openPopup() { this.popupOpenSubject.next(true); }
  closePopup() { this.popupOpenSubject.next(false); }

  getUserCart(userId: number) {
    this.http.get<CartItemModel[]>(`${this.BASIC_URL}?userId=${userId}`, { observe: 'response' }).subscribe({
      next: (data) => {
        this.errorSubject.next(null);
        this.cartItemsSubject.next(data.body);
      },
      error: (err) => {
        this.errorSubject.next(err);
      }
    });
  }

  addCartItem(cartItem: AddToCartModel, userId: number) {
    this.http.post<AddToCartModel>(this.BASIC_URL, cartItem).subscribe({
      next: () => {
        this.getUserCart(userId);
        this.openPopup();
      },
      error: (err) => {
        this.errorSubject.next(err);
      }
    });
  }

  removeCartItem(cartId: number, userId: number) {
    this.http.delete<void>(`${this.BASIC_URL}/${cartId}`).pipe(
      catchError(error => { this.errorSubject.next(error); return EMPTY; }),
      tap(() => { this.getUserCart(userId); })
    ).subscribe();
  }

  changeProductToInValid(cartId: number, userId: number) {
    this.http.put<void>(`${this.BASIC_URL}/changeToNotValid/${cartId}`, null).pipe(
      catchError(error => { this.errorSubject.next(error); return EMPTY; }),
      tap(() => { this.getUserCart(userId); })
    ).subscribe();
  }

  changeProductToValid(cartId: number, userId: number) {
    this.http.put<void>(`${this.BASIC_URL}/changeToValid/${cartId}`, null).pipe(
      catchError(error => { this.errorSubject.next(error); return EMPTY; }),
      tap(() => { this.getUserCart(userId); })
    ).subscribe();
  }
}

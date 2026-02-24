import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { CartItemModel } from '../../Models/CartItemModel';
import { catchError, EMPTY, Observable, tap } from 'rxjs';
import { AddToCartModel } from '../../Models/AddToCartModel';

export interface SessionCartItem {
  productsID: number;
  platformsID: number;
  productsName: string;
  price: number;
  platformName: string;
  imgUrl: string;
  categoryID: number;
}

const SESSION_KEY = 'pendingCartItems';

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

  private sessionCartSubject = new BehaviorSubject<SessionCartItem[]>(this.readSession());
  public sessionCart$: Observable<SessionCartItem[]> = this.sessionCartSubject.asObservable();

  openPopup() { this.popupOpenSubject.next(true); }
  closePopup() { this.popupOpenSubject.next(false); }

  // ── Session cart helpers (guests) ──────────────────────────
  private readSession(): SessionCartItem[] {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY) || '[]'); } catch { return []; }
  }

  private writeSession(items: SessionCartItem[]) {
    sessionStorage.setItem(SESSION_KEY, JSON.stringify(items));
    this.sessionCartSubject.next(items);
  }

  addSessionItem(item: SessionCartItem) {
    this.writeSession([...this.sessionCartSubject.value, item]);
  }

  removeSessionItem(index: number) {
    const updated = this.sessionCartSubject.value.filter((_, i) => i !== index);
    this.writeSession(updated);
  }

  clearSessionCart() {
    sessionStorage.removeItem(SESSION_KEY);
    this.sessionCartSubject.next([]);
  }

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

  addCartItem(cartItem: AddToCartModel, userId: number): Observable<void> {
    return this.http.post<void>(this.BASIC_URL, cartItem).pipe(
      tap(() => {
        this.getUserCart(userId);
        this.openPopup();
      }),
      catchError((err) => {
        this.errorSubject.next(err);
        throw err;
      })
    );
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

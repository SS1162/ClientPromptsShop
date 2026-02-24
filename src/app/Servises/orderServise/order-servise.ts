import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { FullOrderModel } from '../../Models/FullOrderModet';
import { OrderDetailsModel } from '../../Models/OrderDetailsModel ';

@Injectable({
  providedIn: 'root',
})
export class OrderServise {
  private http: HttpClient = inject(HttpClient);
  private BASIC_URL = `${environment.apiUrl}/Orders`;

  private ordersSubject = new BehaviorSubject<FullOrderModel[] | null>(null);
  public orders$: Observable<FullOrderModel[] | null> = this.ordersSubject.asObservable();

  private orderDetailsSubject = new BehaviorSubject<OrderDetailsModel | null>(null);
  public orderDetails$: Observable<OrderDetailsModel | null> = this.orderDetailsSubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable();

  getUserOrders(userId: number) {
    this.http.get<FullOrderModel[]>(`${this.BASIC_URL}/userID/${userId}`).subscribe({
      next: (data) => {
        this.errorSubject.next(null);
        this.ordersSubject.next(data);
      },
      error: (err: HttpErrorResponse) => {
        this.errorSubject.next(err);
      }
    });
  }

  getAllOrders() {
    this.http.get<FullOrderModel[]>(`${this.BASIC_URL}/admin`).subscribe({
      next: (data) => {
        this.errorSubject.next(null);
        this.ordersSubject.next(data);
      },
      error: (err: HttpErrorResponse) => {
        this.errorSubject.next(err);
      }
    });
  }

  getOrderDetails(orderId: number) {
    this.http.get<OrderDetailsModel>(`${this.BASIC_URL}/${orderId}`).subscribe({
      next: (data) => {
        this.errorSubject.next(null);
        this.orderDetailsSubject.next(data);
      },
      error: (err: HttpErrorResponse) => {
        this.errorSubject.next(err);
      }
    });
  }

  fetchOrderDetails(orderId: number): Observable<OrderDetailsModel> {
    return this.http.get<OrderDetailsModel>(`${this.BASIC_URL}/${orderId}`);
  }

  generatePrompt(orderId: number): Observable<string> {
    return this.http.post(`${this.BASIC_URL}/${orderId}/prompt`, {}, { responseType: 'text' });
  }
}

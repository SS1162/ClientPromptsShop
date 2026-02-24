import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface CaptureOrderPayload {
  userID: number;
  orderSum: number;
  basicID: number | undefined;
  products: Array<{
    userID: number;
    productsID: number;
    platformsID: number;
    userDescription: number | null;
  }>;
}

@Injectable({ providedIn: 'root' })
export class PaymentServise {
  private http = inject(HttpClient);

  createOrder(clientAmount: string, currency: string, products: Array<{ userID: number; productsID: number; platformsID: number; userDescription: number | null }>): Observable<{ id: string }> {
    return this.http.post<{ id: string }>(`${environment.apiUrl}/payments/create`, {
      clientAmount,
      currency,
      products
    });
  }

  captureOrder(orderID: string, payload: CaptureOrderPayload): Observable<any> {
    return this.http.post<any>(`${environment.apiUrl}/payments/capture/${orderID}`, payload);
  }
}

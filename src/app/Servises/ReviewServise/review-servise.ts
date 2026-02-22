import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ReviewModel } from '../../Models/ReviewModel';
import { AddReviewModel } from '../../Models/AddReviewModel';
import { BehaviorSubject, Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ReviewServise {
  private http: HttpClient = inject(HttpClient);
  private BASIC_URL: string = `${environment.apiUrl}/Review`;
  private ORDERS_URL: string = `${environment.apiUrl}/Orders`;

  private reviewSubject = new BehaviorSubject<ReviewModel[] | null>(null);
  public review$: Observable<ReviewModel[] | null> = this.reviewSubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable();

  private reviewSavedSubject = new Subject<void>();
  public reviewSaved$: Observable<void> = this.reviewSavedSubject.asObservable();

  getReviews() {
    this.http.get<ReviewModel[]>(this.BASIC_URL).subscribe({
      next: (data) => {
        this.reviewSubject.next(data);
        this.errorSubject.next(null);
      },
      error: (err) => {
        this.errorSubject.next(err);
      }
    });
  }

  // addReview(review: ReviewModel) {
  //   this.http.post<ReviewModel>(this.BASIC_URL, review).subscribe({
  //     next: () => {
  //       this.errorSubject.next(null);
  //       this.getReviews();
  //     },
  //     error: (err) => {
  //       this.errorSubject.next(err);
  //     }
  //   });
  // }

  saveOrderReview(orderId: number, review: AddReviewModel, refreshOrders: () => void) {
    this.http.post(`${this.ORDERS_URL}/${orderId}/review`, review).subscribe({
      next: () => {
        this.errorSubject.next(null);
        this.reviewSavedSubject.next();
        refreshOrders();
      },
      error: (err: HttpErrorResponse) => {
        this.errorSubject.next(err);
      }
    });
  }
}

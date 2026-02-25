import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
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

  private reviewSubject = new BehaviorSubject<ReviewModel[] | null>(null);
  public review$: Observable<ReviewModel[] | null> = this.reviewSubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable();

  private reviewSavedSubject = new Subject<void>();
  public reviewSaved$: Observable<void> = this.reviewSavedSubject.asObservable();

  getReviews(currentPage:number,limit:number) {
    if (currentPage === 1) {
      this.reviewSubject.next(null); // clear stale cache on fresh load
    }
    const params=new HttpParams()
    .set('currentPage',currentPage).set('limit',limit)
    this.http.get<ReviewModel[]>(this.BASIC_URL, { params }).subscribe({

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
    const formData = new FormData();
    formData.append('OrderId', review.orderId.toString());
    formData.append('Score', review.score.toString());
    if (review.Note) formData.append('Note', review.Note);
    if (review.ReviewImg) formData.append('ReviewImg', review.ReviewImg, review.ReviewImg.name);

    this.http.post(`${this.BASIC_URL}`, formData).subscribe({
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

import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { ReviewModel } from '../../Models/ReviewModel';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';
import { Observable } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class ReviewServise {
  http: HttpClient = inject(HttpClient);
  BASIC_URL: string = `${environment.apiUrl}/Review`;
  private reviewSubject = new BehaviorSubject<ReviewModel[] | null>(null)
  public review$: Observable<ReviewModel[] | null> = this.reviewSubject.asObservable()
  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null)
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable()

  getReviews(currentPage:number,limit:number) {
    const params=new HttpParams()
    .set(,currentPage).set(,limit)
    this.http.get<ReviewModel[]>(this.BASIC_URL,params).subscribe({

      next: (data) => {
        this.reviewSubject.next(data)
        this.errorSubject.next(null)
      },
      error: (err) => {
        this.errorSubject.next(err)
      }
    })
  }

  addReview(review:ReviewModel){
      this.http.post<ReviewModel>(this.BASIC_URL,review).subscribe({
      next: (data) => {
        this.errorSubject.next(null)
      },
      error: (err) => {
        this.errorSubject.next(err)
      }
    })
      this.getReviews()
  }



}

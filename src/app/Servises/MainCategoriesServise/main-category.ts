import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MainCategoriesModel } from '../../Models/MainCategoriesModel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Injectable({
  providedIn: 'root',
})
export class MainCategoryServise {
  constructor(){
    const temp:string|null=sessionStorage.getItem('mainCategories')
    if(temp!==null){
      this.mainCategoriesSubject.next(JSON.parse(temp))
    }
  }
  private http = inject(HttpClient)
  private mainCategoriesSubject = new BehaviorSubject<MainCategoriesModel[] | null>(null)
  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null)
  public mainCategories$: Observable<MainCategoriesModel[] | null> = this.mainCategoriesSubject.asObservable()
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable()
  BASIC_URL: string = `${environment.apiUrl}/MainCategories`
  getMainCategory() {
    this.http.get<MainCategoriesModel[]>(this.BASIC_URL).subscribe({
      next: (data) => {
        this.errorSubject.next(null)
        this.mainCategoriesSubject.next(data)
        sessionStorage.setItem('mainCategories', JSON.stringify(data))
      },
      error: (err) => {
        this.errorSubject.next(err)
      }
    })
  }

}

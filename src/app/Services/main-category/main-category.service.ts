import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MainCategoriesModel } from '../../Models/MainCategoriesModel';
import { ManagerMainCategoryModel } from '../../Models/ManagerMainCategoryModel';

@Injectable({
  providedIn: 'root',
})
export class MainCategoryService {
  private http = inject(HttpClient);
  private readonly BASIC_URL: string = `${environment.apiUrl}/MainCategories`;

  // State management with Subjects
  private mainCategoriesSubject = new BehaviorSubject<MainCategoriesModel[] | null>(null);
  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);

  public mainCategories$ = this.mainCategoriesSubject.asObservable();
  public error$ = this.errorSubject.asObservable();

  constructor() {
    const temp = sessionStorage.getItem('mainCategories');
    if (temp) {
      this.mainCategoriesSubject.next(JSON.parse(temp));
    }
  }

  // GET: api/MainCategories
  getMainCategory(): void {
    this.http.get<MainCategoriesModel[]>(this.BASIC_URL).subscribe({
      next: (data) => {
        this.errorSubject.next(null);
        this.mainCategoriesSubject.next(data);
        sessionStorage.setItem('mainCategories', JSON.stringify(data));
      },
      error: (err) => this.errorSubject.next(err)
    });
  }

  addMainCategory(mainCategory: { mainCategoryName: string }): Observable<MainCategoriesModel> {
    return this.http.post<MainCategoriesModel>(`${this.BASIC_URL}/admin`, mainCategory);
  }

  updateMainCategory(id: number, mainCategory: MainCategoriesModel): Observable<void> {
    return this.http.put<void>(`${this.BASIC_URL}/admin/${id}`, mainCategory);
  }

  deleteMainCategory(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASIC_URL}/admin/${id}`);
  }

}

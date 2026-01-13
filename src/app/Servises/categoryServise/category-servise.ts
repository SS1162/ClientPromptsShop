import { inject, Injectable } from '@angular/core';
import { CategoryModel } from '../../Models/categoryModel';
import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProductModel } from '../../Models/ProductModel';
import { ResponePageModel } from '../../Models/ResponePageModel';


@Injectable({
  providedIn: 'root',
})
export class CategoryServise {
  categoryModel: CategoryModel[] = []
  private http: HttpClient = inject(HttpClient)
  BASIC_URL: string = `${environment.apiUrl}/Categories`;

  getcategory(numberOfPages: number, mainCategoryID: number, pageSize: number, search?: string): Observable<HttpResponse<ResponePageModel<CategoryModel>>> {
    let params = new HttpParams()
      .set('numberOfPages', numberOfPages)
      .set('mainCategoryID', mainCategoryID)
      .set('pageSize', pageSize)
    if (search)
      params = params.set('search', search)
    return this.http.get<ResponePageModel<CategoryModel>>(this.BASIC_URL, { params: params, observe: 'response' })
  }
getCategoryByID(id:number):Observable<HttpResponse<CategoryModel>>{
return this.http.get<CategoryModel>(`${this.BASIC_URL}/${id}`,{observe:'response'})
}

}

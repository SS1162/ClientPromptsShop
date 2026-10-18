import { HttpClient, HttpParams,HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ResponsePageModel } from '../../Models/ResponsePageModel';
import { CategoryModel } from '../../Models/CategoryModel';

@Injectable({
 providedIn: 'root',
})
export class CategoryService {
 private http = inject(HttpClient);
 private readonly BASIC_URL: string = `${environment.apiUrl}/Categories`;

 // GET: api/Categories (page of categories for a main category)
   getcategory(numberOfPages: number, mainCategoryID: number, pageSize: number, search?: string): Observable<HttpResponse<ResponsePageModel<CategoryModel>>> {
    let params = new HttpParams()
      .set('numberOfPages', numberOfPages)
      .set('mainCategoryID', mainCategoryID)
      .set('pageSize', pageSize)
    if (search)
      params = params.set('search', search)
    return this.http.get<ResponsePageModel<CategoryModel>>(this.BASIC_URL, { params: params, observe: 'response' })
  }

 // GET: api/Categories/{id} (by id)
getCategoryByID(id:number):Observable<HttpResponse<CategoryModel>>{
return this.http.get<CategoryModel>(`${this.BASIC_URL}/${id}`,{observe:'response'})
}

addCategory(formData: FormData): Observable<CategoryModel> {
  return this.http.post<CategoryModel>(`${this.BASIC_URL}/admin`, formData);
}

updateCategory(id: number, formData: FormData): Observable<void> {
  return this.http.put<void>(`${this.BASIC_URL}/admin/${id}`, formData);
}

deleteCategory(id: number): Observable<void> {
  return this.http.delete<void>(`${this.BASIC_URL}/admin/${id}`);
}

}

// import { inject, Injectable } from '@angular/core';
// import { CategoryModel } from '../../Models/categoryModel';
// import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
// import { environment } from '../../../environments/environment';
// import { Observable } from 'rxjs';
// import { ProductModel } from '../../Models/ProductModel';
// import { ResponePageModel } from '../../Models/ResponePageModel';


// @Injectable({
//   providedIn: 'root',
// })
// export class CategoryServise {
//   categoryModel: CategoryModel[] = []
//   private http: HttpClient = inject(HttpClient)
//   BASIC_URL: string = `${environment.apiUrl}/Categories`;


// getCategoryByID(id:number):Observable<HttpResponse<CategoryModel>>{
// return this.http.get<CategoryModel>(`${this.BASIC_URL}/${id}`,{observe:'response'})
// }
// }
import { HttpClient, HttpParams,HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ResponePageModel } from '../../Models/ResponePageModel';
import { CategoryModel } from '../../Models/categoryModel';

@Injectable({
 providedIn: 'root',
})
export class CategoryServise {
 private http = inject(HttpClient);
 private readonly BASIC_URL: string = `${environment.apiUrl}/Categories`;

 // GET: api/Categories (קבלת דף קטגוריות לפי קטגוריה ראשית)
   getcategory(numberOfPages: number, mainCategoryID: number, pageSize: number, search?: string): Observable<HttpResponse<ResponePageModel<CategoryModel>>> {
    let params = new HttpParams()
      .set('numberOfPages', numberOfPages)
      .set('mainCategoryID', mainCategoryID)
      .set('pageSize', pageSize)
    if (search)
      params = params.set('search', search)
    return this.http.get<ResponePageModel<CategoryModel>>(this.BASIC_URL, { params: params, observe: 'response' })
  }

 // GET: api/Categories/{id} (לפי מזהה ספציפי)
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

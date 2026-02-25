// import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
// import { inject, Injectable } from '@angular/core';
// import { environment } from '../../../environments/environment';
// import { Observable } from 'rxjs';
// import { ProductModel } from '../../Models/ProductModel';
// import { ResponePageModel } from '../../Models/ResponePageModel';

// @Injectable({
//   providedIn: 'root',
// })
// export class ProductServise {
//   productServise!:ProductServise[]
//   http:HttpClient=inject(HttpClient)
// BASIC_URL: string = `${environment.apiUrl}/Products`;

// getAllProducts(): Observable<ProductModel[]> {
//   return this.http.get<ProductModel[]>(`${this.BASIC_URL}/all`);
// }

// getProduct( categoryID:number,  numOfPages:number,  PageSize:number,  search?:string, minPrice?:number,  MaxPrice?:number, orderByPrice?:boolean, desc?:boolean):Observable<HttpResponse<ResponePageModel<ProductModel>>>{
// let params=new HttpParams()
// .set('categoryID',categoryID)
// .set('numOfPages',numOfPages)
// .set('PageSize',PageSize)
// if(search)
// params=params.set('search',search)

// if(minPrice)
// params=params.set('minPrice',minPrice)

// if(MaxPrice)
// params=params.set('MaxPrice',MaxPrice)

// if(orderByPrice)
// params=params.set('orderByPrice',orderByPrice)

// if(desc)
// params=params.set('desc',desc)
// return this.http.get< ResponePageModel<ProductModel>>(this.BASIC_URL,{params:params,observe:'response'})
// }
// }
import { HttpClient, HttpParams,HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, tap } from 'rxjs';
import { ProductModel } from '../../Models/ProductModel';
import { ResponePageModel } from '../../Models/ResponePageModel';
import { AddProductModel } from '../../Models/AddProductModel';
import { UpdateProductModel } from '../../Models/UpdateProductModel';

@Injectable({
  providedIn: 'root',
})
export class ProductServise {
  private http = inject(HttpClient);
  private readonly BASIC_URL: string = `${environment.apiUrl}/Products`;

  // GET: api/Products/admin (GetAll)
  getAllProducts(): Observable<ProductModel[]> {
    return this.http.get<ProductModel[]>(`${this.BASIC_URL}/admin`);
  }
  getProduct( categoryID:number,  numOfPages:number,  PageSize:number,  search?:string, minPrice?:number,  MaxPrice?:number, orderByPrice?:boolean, desc?:boolean):Observable<HttpResponse<ResponePageModel<ProductModel>>>{

let params=new HttpParams()
.set('categoryID',categoryID)
.set('numOfPages',numOfPages)
.set('PageSize',PageSize)
if(search)
params=params.set('search',search)

if(minPrice)
params=params.set('minPrice',minPrice)

if(MaxPrice)
params=params.set('MaxPrice',MaxPrice)

if(orderByPrice)
params=params.set('orderByPrice',orderByPrice)

if(desc)
params=params.set('desc',desc)
return this.http.get< ResponePageModel<ProductModel>>(this.BASIC_URL,{params:params,observe:'response'})
}

  // POST: api/Products/admin (הוספת מוצר)
  addProduct(product: AddProductModel): Observable<ProductModel> {
    return this.http.post<ProductModel>(`${this.BASIC_URL}/admin`, product).pipe(
      tap(() => this.getAllProducts()) // קריאה ל-GetAll אחרי שינוי
    );
  }

  // PUT: api/Products/admin/{id} (עדכון מוצר)
  updateProduct(id: number, product: UpdateProductModel): Observable<void> {
    return this.http.put<void>(`${this.BASIC_URL}/admin/${id}`, product).pipe(
      tap(() => this.getAllProducts()) // קריאה ל-GetAll אחרי שינוי
    );
  }

  // DELETE: api/Products/admin/{id} (מחיקת מוצר)
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BASIC_URL}/admin/${id}`).pipe(
      tap(() => this.getAllProducts()) // קריאה ל-GetAll אחרי שינוי
    );
  }
}
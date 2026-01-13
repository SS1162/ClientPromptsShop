import { HttpClient, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';
import { ProductModel } from '../../Models/ProductModel';
import { ResponePageModel } from '../../Models/ResponePageModel';

@Injectable({
  providedIn: 'root',
})
export class ProductServise {
  productServise!:ProductServise[]
  http:HttpClient=inject(HttpClient)
BASIC_URL: string = `${environment.apiUrl}/Products`;

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
}

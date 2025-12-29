import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable, Observer } from 'rxjs';
import { environment } from '../../../environments/environment';
import { MainCategoriesModel } from '../../Models/MainCategoriesModel';

@Injectable({
  providedIn: 'root',
})
export class MainCategoryServise {
  private http =inject(HttpClient)
  BASIC_URL:string=`${environment.apiUrl}/MainCategories`
  getMainCategory():Observable<HttpResponse<MainCategoriesModel[]>>
  {
        return this.http.get<MainCategoriesModel[]>(this.BASIC_URL,{observe:'response'})
  }
  
}

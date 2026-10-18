import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PasswordModel } from '../../Models/PasswordModel';

@Injectable({
  providedIn: 'root',
})
export class PasswordService {
  BASIC_URL:string=`${environment.apiUrl}/password`;
  http:HttpClient=inject(HttpClient);

  postPassword(passwordData: PasswordModel):Observable<HttpResponse<number>>{
    return this.http.post<number>(this.BASIC_URL,passwordData,{observe:'response'});
  }
}
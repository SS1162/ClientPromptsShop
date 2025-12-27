import { HttpClient, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { PasswordModule } from 'primeng/password';

@Injectable({
  providedIn: 'root',
})
export class PasswordServise {
  BASIC_URL:string=`${environment.apiUrl}/password`;
  http:HttpClient=inject(HttpClient);

  postPassword(passwordData:PasswordModule):Observable<HttpResponse<number>>{
    return this.http.post<number>(this.BASIC_URL,passwordData,{observe:'response'});
  }
}
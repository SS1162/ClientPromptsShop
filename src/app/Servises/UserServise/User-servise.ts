import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { UserModel } from '../../Models/UserModel';
import { environment } from '../../../environments/environment';
import { LoginModel } from '../../Models/LoginModel';
import { UpdateUserModel } from '../../Models/UpdateUserModel';
import { RegisterUserModel } from '../../Models/RegisterUserModel';



@Injectable({
  providedIn: 'root',
})
export class UserServise {
//  loginUser:LoginModel=new LoginModel();

http:HttpClient=inject(HttpClient);
BASIC_URL:string=`${environment.apiUrl}/users`;

  LoginUser(loginData:LoginModel):Observable<HttpResponse<UserModel>>{
    
    return this.http.post<UserModel>(`${this.BASIC_URL}/loginFunction`,loginData,{observe:'response'});
  }


    RegisterUser(registerData:RegisterUserModel):Observable<HttpResponse<UserModel>>{

    return this.http.post<UserModel>(`${this.BASIC_URL}`,registerData,{observe:'response'});
  }


    UpdaterUser(registerData:UpdateUserModel,id:number):Observable<HttpResponse<void>>{

    return this.http.put<void>(`${this.BASIC_URL}/${id}`,registerData,{observe:'response'});
  }
}


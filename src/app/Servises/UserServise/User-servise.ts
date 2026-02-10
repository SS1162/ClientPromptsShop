import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, Subject } from 'rxjs';
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

  http: HttpClient = inject(HttpClient);
  BASIC_URL: string = `${environment.apiUrl}/users`;
  private userSubject = new BehaviorSubject<UserModel | null>(null)
  public user$: Observable<UserModel | null> = this.userSubject.asObservable()
  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null)
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable()
  private sucssesToRegisterSubject = new BehaviorSubject<boolean | null>(null)
  public sucssesToRegister: Observable<boolean | null> = this.sucssesToRegisterSubject.asObservable()
  constructor() {
    const temp = sessionStorage.getItem('user')
    if (temp !== null) {
      this.userSubject.next(JSON.parse(temp))
    }
  }
  LoginUser(loginData: LoginModel) {
    this.http.post<UserModel>(`${this.BASIC_URL}/loginFunction`, loginData)
      .subscribe({
        next: (data) => {
          this.userSubject.next(data)
          this.errorSubject.next(null)
          sessionStorage.setItem('user', JSON.stringify(data))
        }
        ,
        error: (err) => {
          this.errorSubject.next(err)
        }
      })

  }

  GetByID(id: number) {
    this.http.get<UserModel>(`${this.BASIC_URL}/${id}`)
      .subscribe({
        next: (data) => {
          this.userSubject.next(data)
          this.errorSubject.next(null)
        }
        ,
        error: (err) => {
          this.errorSubject.next(err)
        }
      })
  }

  LogOut() {
    this.userSubject.next(null)
  }

  RegisterUser(registerData: RegisterUserModel) {

    this.http.post<UserModel>(`${this.BASIC_URL}`, registerData)
      .subscribe({
        next: (data) => {
          this.sucssesToRegisterSubject.next(true)
          this.errorSubject.next(null)

        }
        ,
        error: (err) => {
          this.sucssesToRegisterSubject.next(false)
          this.errorSubject.next(err)
        }
      })
  }


  UpdaterUser(registerData: UpdateUserModel, id: number) {
    this.http.put<void>(`${this.BASIC_URL}/${id}`, registerData)
      .subscribe({
        next: () => {
          this.errorSubject.next(null)
        }
        ,
        error: (err) => {
          this.errorSubject.next(err)
        }
      })
    this.GetByID(id)
  }


  signInWithGoogle(registerData: RegisterUserModel) {

this.http.post<UserModel>(`${this.BASIC_URL}/signInWithGoogle`, registerData)
       .subscribe({
        next: (data) => {
          this.userSubject.next(data)
          this.errorSubject.next(null)
          sessionStorage.setItem('user', JSON.stringify(data))
          
        }
        ,
        error: (err) => {
          this.errorSubject.next(err)
        }
      })
  }
}


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
  private isAdminSubject = new BehaviorSubject<boolean>(false)
  public isAdmin$: Observable<boolean> = this.isAdminSubject.asObservable()
  constructor() {
    const temp = sessionStorage.getItem('user')
    if (temp !== null) {
      this.userSubject.next(JSON.parse(temp))
    }
    const isAdmin = sessionStorage.getItem('isAdmin')
    if (isAdmin === 'true') {
      this.isAdminSubject.next(true)
    }
  }
  LoginUser(loginData: LoginModel) {
    this.http.post<UserModel>(`${this.BASIC_URL}/loginFunction`, loginData)
      .subscribe({
        next: (data) => {
          this.userSubject.next(data)
          this.errorSubject.next(null)
          sessionStorage.setItem('user', JSON.stringify(data))
          this.checkIsAdmin(data.userID)
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
          sessionStorage.setItem('user', JSON.stringify(data))
        }
        ,
        error: (err) => {
          this.errorSubject.next(err)
        }
      })
  }

  LogOut() {
    this.userSubject.next(null)
    this.isAdminSubject.next(false)
    sessionStorage.removeItem('user');
    sessionStorage.removeItem('isAdmin');
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
          this.GetByID(id)
        }
        ,
        error: (err) => {
          this.errorSubject.next(err)
        }
      })

  }


  signInWithGoogle(registerData: RegisterUserModel) {

    this.http.post<UserModel>(`${this.BASIC_URL}/signInWithGoogle`, registerData)

  }


  checkIsAdmin(userID: number): void {
    this.http.get<boolean>(`${this.BASIC_URL}/isAdmin/${userID}`).subscribe({
      next: (data) => {
        this.isAdminSubject.next(data)
        sessionStorage.setItem('isAdmin', String(data))
      },
      error: () => {
        this.isAdminSubject.next(false)
        sessionStorage.removeItem('isAdmin')
      }
    })
  }

  isAdmin(userID: number): void {
    this.checkIsAdmin(userID)
  }


}


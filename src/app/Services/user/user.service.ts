import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, of, tap } from 'rxjs';
import { UserModel } from '../../Models/UserModel';
import { environment } from '../../../environments/environment';
import { LoginModel } from '../../Models/LoginModel';
import { UpdateUserModel } from '../../Models/UpdateUserModel';
import { RegisterUserModel } from '../../Models/RegisterUserModel';

@Injectable({
  providedIn: 'root',
})
export class UserService {
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
        next: (data) => this.onSignedIn(data),
        error: (err) => {
          this.errorSubject.next(err)
        }
      })
  }

  private onSignedIn(data: UserModel) {
    this.userSubject.next(data)
    this.errorSubject.next(null)
    sessionStorage.setItem('user', JSON.stringify(data))
    this.checkIsAdmin(data.userID)
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
      .subscribe({
        next: (data) => this.onSignedIn(data),
        error: (err) => {
          this.errorSubject.next(err)
        }
      })
  }

  checkIsAdmin(userID: number): void {
    this.verifyIsAdmin(userID).subscribe()
  }

  /** Asks the server whether the user is an admin and caches the answer for the UI. */
  verifyIsAdmin(userID: number): Observable<boolean> {
    return this.http.get<boolean>(`${this.BASIC_URL}/isAdmin/${userID}`).pipe(
      tap((data) => {
        this.isAdminSubject.next(data)
        sessionStorage.setItem('isAdmin', String(data))
      }),
      catchError(() => {
        this.isAdminSubject.next(false)
        sessionStorage.removeItem('isAdmin')
        return of(false)
      })
    )
  }
}


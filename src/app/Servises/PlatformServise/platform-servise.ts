import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { CartItemModel } from '../../Models/CartItemModel';
import { PlatformsModel } from '../../Models/PlatformsModel';



@Injectable({
  providedIn: 'root',
})
export class PlatformServise {
  http: HttpClient = inject(HttpClient);
  BASIC_URL: string = `${environment.apiUrl}/Platforms`;


  private platformsSubject = new BehaviorSubject<PlatformsModel[] | null>(null);
  public platforms$: Observable<PlatformsModel[] | null> = this.platformsSubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable();

  getPlatforms(): void {
    this.http.get<PlatformsModel[]>(this.BASIC_URL).subscribe({
      next: (platforms) => {
        this.platformsSubject.next(platforms);
        this.errorSubject.next(null);
      },
      error: (error: HttpErrorResponse) => this.errorSubject.next(error),
    });
  }
}

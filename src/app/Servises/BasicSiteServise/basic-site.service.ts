import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AddBasicSiteModel } from '../../Models/AddBasicSiteModel';
import { BasicSiteModel } from '../../Models/BasicSiteModel';

@Injectable({
  providedIn: 'root',
})
export class BasicSiteService {
  http: HttpClient = inject(HttpClient);
  BASIC_URL: string = `${environment.apiUrl}/BasicSite`;

  private basicSitesSubject = new BehaviorSubject<BasicSiteModel | null>(null);
  public basicSites$: Observable<BasicSiteModel | null> = this.basicSitesSubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable();

  addBasicSite(basicSite: AddBasicSiteModel): Observable<BasicSiteModel> {
    return new Observable((observer) => {
      this.http.post<BasicSiteModel>(this.BASIC_URL, basicSite).subscribe({
        next: (result) => {
          this.errorSubject.next(null);
          observer.next(result);

        },
        error: (error: HttpErrorResponse) => {
          this.errorSubject.next(error);
          observer.error(error);
        },
      });
    });
  }

  getBasicSites(basicSiteId:number): void {
    this.http.get<BasicSiteModel>(`${this.BASIC_URL}/${basicSiteId}`).subscribe({
      next: (basicSites) => {
        this.basicSitesSubject.next(basicSites);
        this.errorSubject.next(null);
      },
      error: (error: HttpErrorResponse) => this.errorSubject.next(error),
    });
  }
}

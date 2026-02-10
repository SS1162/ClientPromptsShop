import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { SiteTypeModel } from '../../Models/SiteTypeModel';


@Injectable({
  providedIn: 'root',
})
export class SiteTypeService {
  http: HttpClient = inject(HttpClient);
  SITE_TYPES_URL: string = `${environment.apiUrl}/SiteTypes`;

  private siteTypesSubject = new BehaviorSubject<SiteTypeModel[] | null>(null);
  public siteTypes$: Observable<SiteTypeModel[] | null> = this.siteTypesSubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$: Observable<HttpErrorResponse | null> = this.errorSubject.asObservable();

  getSiteTypes(): void {
    this.http.get<SiteTypeModel[]>(this.SITE_TYPES_URL).subscribe({
      next: (siteTypes) => {
        this.siteTypesSubject.next(siteTypes);
        this.errorSubject.next(null);
      },
      error: (error: HttpErrorResponse) => this.errorSubject.next(error),
    });
  }
}

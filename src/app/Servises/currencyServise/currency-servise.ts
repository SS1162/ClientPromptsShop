import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject } from 'rxjs';

export interface CurrencyOption {
  code: string;
  name: string;
}

@Injectable({ providedIn: 'root' })
export class CurrencyServise {
  private http = inject(HttpClient);

  private currenciesSubject = new BehaviorSubject<CurrencyOption[]>([]);
  public currencies$ = this.currenciesSubject.asObservable();

  private selectedCurrencySubject = new BehaviorSubject<CurrencyOption>({ code: 'USD', name: 'United States Dollar' });
  public selectedCurrency$ = this.selectedCurrencySubject.asObservable();

  private errorSubject = new BehaviorSubject<HttpErrorResponse | null>(null);
  public error$ = this.errorSubject.asObservable();

  private rateSubject = new BehaviorSubject<number>(1);
  public rate$ = this.rateSubject.asObservable();

  get selectedCurrency(): CurrencyOption {
    return this.selectedCurrencySubject.value;
  }

  get rate(): number {
    return this.rateSubject.value;
  }

  loadCurrencies(): void {
    if (this.currenciesSubject.value.length > 0) return;
    this.http.get<Record<string, string>>('https://api.frankfurter.app/currencies').subscribe({
      next: (data) => {
        const options: CurrencyOption[] = Object.entries(data).map(([code, name]) => ({ code, name }));
        this.currenciesSubject.next(options);
      },
      error: (err: HttpErrorResponse) => {
        this.errorSubject.next(err);
      }
    });
  }

  selectCurrency(currency: CurrencyOption): void {
    this.selectedCurrencySubject.next(currency);
    if (currency.code === 'USD') {
      this.rateSubject.next(1);
    } else {
      this.fetchRate(currency.code);
    }
  }

  private fetchRate(code: string): void {
    this.http.get<{ amount: number; base: string; date: string; rates: Record<string, number> }>(
      `https://api.frankfurter.app/latest?from=USD&to=${code}`
    ).subscribe({
      next: (data) => {
        const rate = data.rates[code];
        if (rate !== undefined) {
          this.rateSubject.next(rate);
        }
      },
      error: (err: HttpErrorResponse) => {
        this.errorSubject.next(err);
      }
    });
  }
}

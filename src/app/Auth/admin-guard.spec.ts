import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter, Route, Router, UrlTree } from '@angular/router';
import { Observable, firstValueFrom } from 'rxjs';

import { adminGuard } from './admin-guard';
import { UserModel } from '../Models/UserModel';
import { environment } from '../../environments/environment';

describe('adminGuard', () => {
  let http: HttpTestingController;
  let router: Router;

  const runGuard = () =>
    firstValueFrom(
      TestBed.runInInjectionContext(() => adminGuard({} as Route, [])) as Observable<boolean | UrlTree>
    );

  const loginAs = (user: UserModel | null) => {
    sessionStorage.clear();
    if (user) sessionStorage.setItem('user', JSON.stringify(user));
  };

  beforeEach(() => {
    sessionStorage.clear();
  });

  afterEach(() => {
    http?.verify();
    sessionStorage.clear();
  });

  function setup() {
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    http = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  }

  it('redirects anonymous users to /login without calling the server', async () => {
    loginAs(null);
    setup();

    const result = await runGuard();

    expect(router.serializeUrl(result as UrlTree)).toBe('/login');
  });

  it('allows the admin area when the server confirms the user is an admin', async () => {
    loginAs({ userID: 7, userName: 'admin@example.com' });
    setup();

    const result = runGuard();
    http.expectOne(`${environment.apiUrl}/users/isAdmin/7`).flush(true);

    expect(await result).toBeTrue();
  });

  it('ignores a forged isAdmin flag in sessionStorage', async () => {
    loginAs({ userID: 8, userName: 'user@example.com' });
    sessionStorage.setItem('isAdmin', 'true');
    setup();

    const result = runGuard();
    http.expectOne(`${environment.apiUrl}/users/isAdmin/8`).flush(false);

    expect(router.serializeUrl((await result) as UrlTree)).toBe('/login');
  });

  it('redirects to /login when the admin check fails', async () => {
    loginAs({ userID: 9, userName: 'user@example.com' });
    setup();

    const result = runGuard();
    http.expectOne(`${environment.apiUrl}/users/isAdmin/9`).flush('error', { status: 500, statusText: 'Server Error' });

    expect(router.serializeUrl((await result) as UrlTree)).toBe('/login');
  });
});

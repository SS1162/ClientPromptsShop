import { TestBed, fakeAsync, tick } from '@angular/core/testing';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';

import { rateLimitInterceptor } from './rate-limit.interceptor';

describe('rateLimitInterceptor', () => {
  const URL = '/api/test';
  let http: HttpClient;
  let controller: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([rateLimitInterceptor])),
        provideHttpClientTesting(),
      ],
    });
    http = TestBed.inject(HttpClient);
    controller = TestBed.inject(HttpTestingController);
    spyOn(Math, 'random').and.returnValue(0); // no jitter
  });

  afterEach(() => controller.verify());

  const tooManyRequests = (headers: Record<string, string> = {}) =>
    ({ status: 429, statusText: 'Too Many Requests', headers });

  it('retries a 429 with exponential backoff and returns the later success', fakeAsync(() => {
    let result: unknown;
    http.get(URL).subscribe(r => (result = r));

    controller.expectOne(URL).flush(null, tooManyRequests());
    tick(1999);
    controller.expectNone(URL);
    tick(1); // 2^1 * 1000 ms

    controller.expectOne(URL).flush(null, tooManyRequests());
    tick(4000); // 2^2 * 1000 ms

    controller.expectOne(URL).flush({ ok: true });
    expect(result).toEqual({ ok: true });
  }));

  it('waits for the Retry-After header when present', fakeAsync(() => {
    http.get(URL).subscribe();

    controller.expectOne(URL).flush(null, tooManyRequests({ 'Retry-After': '5' }));
    tick(4999);
    controller.expectNone(URL);
    tick(1);

    controller.expectOne(URL).flush({});
  }));

  it('does not retry other errors', fakeAsync(() => {
    let status = 0;
    http.get(URL).subscribe({ error: e => (status = e.status) });

    controller.expectOne(URL).flush(null, { status: 500, statusText: 'Server Error' });
    tick(10_000);

    controller.expectNone(URL);
    expect(status).toBe(500);
  }));

  it('gives up after 3 retries and rethrows the 429', fakeAsync(() => {
    let status = 0;
    http.get(URL).subscribe({ error: e => (status = e.status) });

    for (const delay of [2000, 4000, 8000]) {
      controller.expectOne(URL).flush(null, tooManyRequests());
      tick(delay);
    }
    controller.expectOne(URL).flush(null, tooManyRequests());

    expect(status).toBe(429);
  }));
});

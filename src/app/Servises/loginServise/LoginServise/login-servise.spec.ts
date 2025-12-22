import { TestBed } from '@angular/core/testing';

import { LoginServise } from './login-servise';

describe('LoginServise', () => {
  let service: LoginServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LoginServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PasswordServise } from './password-servise';

describe('PasswordServise', () => {
  let service: PasswordServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PasswordServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

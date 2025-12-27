import { TestBed } from '@angular/core/testing';

import { UserServise } from './User-servise';

describe('UserServise', () => {
  let service: UserServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { PlatformServise } from './platform-servise';

describe('PlatformServise', () => {
  let service: PlatformServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PlatformServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

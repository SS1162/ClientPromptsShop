import { TestBed } from '@angular/core/testing';

import { CartServise } from '../../cart-servise';

describe('CartServise', () => {
  let service: CartServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CartServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

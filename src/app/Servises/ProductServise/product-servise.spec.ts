import { TestBed } from '@angular/core/testing';

import { ProductServise } from './product-servise';

describe('ProductServise', () => {
  let service: ProductServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProductServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

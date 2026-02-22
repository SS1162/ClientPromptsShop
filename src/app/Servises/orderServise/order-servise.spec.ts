import { TestBed } from '@angular/core/testing';

import { OrderServise } from './order-servise';

describe('OrderServise', () => {
  let service: OrderServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OrderServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

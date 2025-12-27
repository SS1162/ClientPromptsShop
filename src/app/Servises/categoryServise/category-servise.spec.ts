import { TestBed } from '@angular/core/testing';

import { CategoryServise } from './category-servise';

describe('CategoryServise', () => {
  let service: CategoryServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CategoryServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

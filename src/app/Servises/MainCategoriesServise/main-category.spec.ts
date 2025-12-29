import { TestBed } from '@angular/core/testing';

import { MainCategory } from './main-category';

describe('MainCategory', () => {
  let service: MainCategory;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MainCategory);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

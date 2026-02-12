import { TestBed } from '@angular/core/testing';

import { ReviewServise } from './review-servise';

describe('ReviewServise', () => {
  let service: ReviewServise;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ReviewServise);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

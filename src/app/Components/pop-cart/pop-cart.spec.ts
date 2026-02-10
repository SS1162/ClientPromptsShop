import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PopCart } from './pop-cart';

describe('PopCart', () => {
  let component: PopCart;
  let fixture: ComponentFixture<PopCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PopCart]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PopCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

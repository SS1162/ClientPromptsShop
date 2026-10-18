import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';

import { FullScreenCart } from './full-screen-cart';

describe('FullScreenCart', () => {
  let component: FullScreenCart;
  let fixture: ComponentFixture<FullScreenCart>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FullScreenCart],
      providers: [provideRouter([])]
    })
    .compileComponents();

    fixture = TestBed.createComponent(FullScreenCart);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

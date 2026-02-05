import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ButtomNevigation } from './buttom-nevigation';

describe('ButtomNevigation', () => {
  let component: ButtomNevigation;
  let fixture: ComponentFixture<ButtomNevigation>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ButtomNevigation]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ButtomNevigation);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

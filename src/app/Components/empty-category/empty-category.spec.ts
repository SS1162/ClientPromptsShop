import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EmptyCategory } from './empty-category';

describe('EmptyCategory', () => {
  let component: EmptyCategory;
  let fixture: ComponentFixture<EmptyCategory>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EmptyCategory]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EmptyCategory);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

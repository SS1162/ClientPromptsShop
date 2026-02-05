import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlatformGuides } from './platform-guides';

describe('PlatformGuides', () => {
  let component: PlatformGuides;
  let fixture: ComponentFixture<PlatformGuides>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlatformGuides]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PlatformGuides);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

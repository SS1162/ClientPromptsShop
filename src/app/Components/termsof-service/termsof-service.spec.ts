import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TermsofService } from './termsof-service';

describe('TermsofService', () => {
  let component: TermsofService;
  let fixture: ComponentFixture<TermsofService>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TermsofService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TermsofService);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

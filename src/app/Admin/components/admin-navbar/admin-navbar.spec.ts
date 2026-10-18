import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';

import { AdminNavbar } from './admin-navbar';

describe('AdminNavbar', () => {
  let component: AdminNavbar;
  let fixture: ComponentFixture<AdminNavbar>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdminNavbar],
      providers: [provideRouter([]), ConfirmationService, MessageService]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdminNavbar);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { CheckboxModule } from 'primeng/checkbox';
import { ToastModule } from 'primeng/toast';
import { SiteTypeService } from '../../../Servises/SiteTypeService/site-type.service';
import { UserServise } from '../../../Servises/UserServise/User-servise';
import { SiteTypeModel } from '../../../Models/SiteTypeModel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-site-types',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    InputTextModule,
    InputNumberModule,
    TextareaModule,
    CheckboxModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-site-types.html',
  styleUrl: './admin-site-types.scss',
})
export class AdminSiteTypes implements OnInit {
  private siteTypeServise: SiteTypeService = inject(SiteTypeService);
  private userServise: UserServise = inject(UserServise);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  siteTypes: SiteTypeModel[] = [];
  selectedSiteType: any = {};
  siteTypeDialog = false;
  submitted = false;
  loading = true;

  ngOnInit() {
    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        }
      }
    });

    this.siteTypeServise.siteTypes$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          this.siteTypes = data;
          this.loading = false;
        }
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load site types' });
        this.loading = false;
      }
    });

    this.siteTypeServise.getSiteTypes();
  }

  openNew() {
    this.selectedSiteType = { siteTypeName: '', price: 0, siteTypeDescription: '', siteTypeNamePrompt: '', siteTypeDescriptionPrompt: '' };
    this.submitted = false;
    this.siteTypeDialog = true;
  }

  editSiteType(siteType: SiteTypeModel) {
    this.selectedSiteType = { ...siteType };
    this.siteTypeDialog = true;
  }

  hideDialog() {
    this.siteTypeDialog = false;
    this.submitted = false;
  }

  async saveSiteType() {
    this.submitted = true;
    if (this.selectedSiteType.siteTypeName?.trim()) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Save functionality to be implemented' });
      this.siteTypeDialog = false;
      this.siteTypeServise.getSiteTypes();
    }
  }

  deleteSiteType(siteType: SiteTypeModel) {
    if (confirm(`Delete ${siteType.siteTypeName}?`)) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Delete functionality to be implemented' });
    }
  }
}

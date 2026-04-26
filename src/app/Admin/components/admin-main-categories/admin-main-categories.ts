import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MainCategoryServise } from '../../../Servises/MainCategoriesServise/main-category';
import { UserServise } from '../../../Servises/UserServise/User-servise';
import { MainCategoriesModel } from '../../../Models/MainCategoriesModel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-main-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-main-categories.html',
  styleUrl: './admin-main-categories.scss',
})
export class AdminMainCategories implements OnInit {
  private mainCategoriesServise: MainCategoryServise = inject(MainCategoryServise);
  private userServise: UserServise = inject(UserServise);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  mainCategories: MainCategoriesModel[] = [];
  selectedCategory: any = {};
  categoryDialog = false;
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

    this.mainCategoriesServise.mainCategories$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          this.mainCategories = data;
          this.loading = false;
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load categories' });
        this.loading = false;
      }
    });

    this.mainCategoriesServise.getMainCategory();
  }

  openNew() {
    this.selectedCategory = { mainCategoryName: '', promptTemplate: '' };
    this.submitted = false;
    this.categoryDialog = true;
  }

  editCategory(category: MainCategoriesModel) {
    this.selectedCategory = { ...category };
    this.categoryDialog = true;
  }

  hideDialog() {
    this.categoryDialog = false;
    this.submitted = false;
  }

  saveCategory() {
    this.submitted = true;
<<<<<<< HEAD
    if (!this.selectedCategory.mainCategoryName?.trim()) {
      return;
    }

    if (this.selectedCategory.mainCategoryID) {
      this.mainCategoriesServise.updateMainCategory(this.selectedCategory.mainCategoryID, this.selectedCategory).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Main category updated successfully' });
          this.categoryDialog = false;
          this.mainCategoriesServise.getMainCategory();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update main category' });
        }
      });
    } else {
      this.mainCategoriesServise.addMainCategory({ mainCategoryName: this.selectedCategory.mainCategoryName }).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Main category created successfully' });
          this.categoryDialog = false;
          this.mainCategoriesServise.getMainCategory();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create main category' });
        }
      });
=======
    if (this.selectedCategory.mainCategoryName?.trim()) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Save functionality to be implemented' });
      this.categoryDialog = false;
      
>>>>>>> 337b76aea4d0e26ab893c1a8dad5b7dee7927501
    }
  }

  deleteCategory(category: MainCategoriesModel) {
    if (confirm(`Delete ${category.mainCategoryName}?`)) {
      this.mainCategoriesServise.deleteMainCategory(category.mainCategoryID).subscribe({
        next: () => {
          this.mainCategories = this.mainCategories.filter(c => c.mainCategoryID !== category.mainCategoryID);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Main category deleted successfully' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete main category' });
        }
      });
    }
  }
}

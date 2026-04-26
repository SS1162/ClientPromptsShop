import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TextareaModule } from 'primeng/textarea';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { TableModule } from 'primeng/table';
import { CategoryServise } from '../../../Servises/categoryServise/category-servise';
import { MainCategoryServise } from '../../../Servises/MainCategoriesServise/main-category';
import { UserServise } from '../../../Servises/UserServise/User-servise';
import { CategoryModel } from '../../../Models/categoryModel';
import { MainCategoriesModel } from '../../../Models/MainCategoriesModel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-admin-sub-categories',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    TextareaModule,
    SelectModule,
    ToastModule,
    TableModule
  ],
  providers: [MessageService],
  templateUrl: './admin-sub-categories.html',
  styleUrl: './admin-sub-categories.scss',
})
export class AdminSubCategories implements OnInit {
  private categoryServise: CategoryServise = inject(CategoryServise);
  private mainCategoryServise: MainCategoryServise = inject(MainCategoryServise);
  private userServise: UserServise = inject(UserServise);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  subCategories: CategoryModel[] = [];
  mainCategories: MainCategoriesModel[] = [];
  selectedSubCategory: any = {};
  subCategoryDialog = false;
  submitted = false;
  loading = true;
  selectedFile: File | null = null;
  imagePreview: string | null = null;
  IMG_URL = environment.staticFilesUrl;

  ngOnInit() {
    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/login']);
        }
      }
    });

    this.mainCategoryServise.mainCategories$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          this.mainCategories = data;
          this.subCategories = [];
          let pending = data.length;
          if (pending === 0) { this.loading = false; return; }
          data.forEach(mc => {
            this.categoryServise.getcategory(1, mc.mainCategoryID, 100).subscribe({
              next: (response) => {
                if (response.body?.data) {
                  this.subCategories = [...this.subCategories, ...response.body.data];
                }
                pending--;
                if (pending === 0) this.loading = false;
              },
              error: () => {
                pending--;
                if (pending === 0) this.loading = false;
              }
            });
          });
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load data' });
        this.loading = false;
      }
    });

    this.mainCategoryServise.getMainCategory();
  }

  openNew() {
    this.selectedSubCategory = { categoryName: '', mainCategoryID: null, categoryDescreption: '', imgUrl: '' };
    this.submitted = false;
    this.selectedFile = null;
    this.imagePreview = null;
    this.subCategoryDialog = true;
  }

  editSubCategory(subCategory: CategoryModel) {
    this.selectedSubCategory = { ...subCategory };
    this.selectedFile = null;
    this.imagePreview = subCategory.imgUrl || null;
    this.subCategoryDialog = true;
  }

  hideDialog() {
    this.subCategoryDialog = false;
    this.submitted = false;
    this.selectedFile = null;
    this.imagePreview = null;
  }

  onFileSelect(event: any) {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.selectedSubCategory.imgUrl = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage() {
    this.selectedFile = null;
    this.imagePreview = null;
    this.selectedSubCategory.imgUrl = '';
  }

  async saveSubCategory() {
    this.submitted = true;
    if (!this.selectedSubCategory.categoryName?.trim() || !this.selectedSubCategory.mainCategoryID) {
      return;
    }

    const formData = new FormData();
    formData.append('categoryName', this.selectedSubCategory.categoryName);
    formData.append('mainCategoryID', this.selectedSubCategory.mainCategoryID.toString());
    if (this.selectedSubCategory.categoryDescreption) {
      formData.append('categoryDescreption', this.selectedSubCategory.categoryDescreption);
    }
    if (this.selectedFile) {
      formData.append('imgUrl', this.selectedFile);
    }

    if (this.selectedSubCategory.categoryID) {
      this.categoryServise.updateCategory(this.selectedSubCategory.categoryID, formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category updated successfully' });
          this.subCategoryDialog = false;
          this.mainCategoryServise.getMainCategory();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update category' });
        }
      });
    } else {
      this.categoryServise.addCategory(formData).subscribe({
        next: () => {
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category created successfully' });
          this.subCategoryDialog = false;
          this.mainCategoryServise.getMainCategory();
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create category' });
        }
      });
    }
  }

  async deleteSubCategory(subCategory: CategoryModel) {
    if (confirm(`Delete ${subCategory.categoryName}?`)) {
      this.categoryServise.deleteCategory(subCategory.categoryID).subscribe({
        next: () => {
          this.subCategories = this.subCategories.filter(c => c.categoryID !== subCategory.categoryID);
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Category deleted successfully' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete category' });
        }
      });
    }
  }

  getMainCategoryName(mainCategoryID: number): string {
    const category = this.mainCategories.find(c => c.mainCategoryID === mainCategoryID);
    return category?.mainCategoryName || 'Unknown';
  }
}

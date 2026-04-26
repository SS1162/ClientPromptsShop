import { Component, OnInit, inject } from '@angular/core';
import { MessageService } from 'primeng/api';
import { ProductModel } from '../../../Models/ProductModel';
import { ProductServise } from '../../../Servises/ProductServise/product-servise';
import { environment } from '../../../../environments/environment';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { TooltipModule } from 'primeng/tooltip';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-admin-products',
  standalone: true,
  templateUrl: './admin-products.html',
  styleUrls: ['./admin-products.scss'],
  providers: [MessageService],
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
    ToastModule,
    TooltipModule
  ]
})
export class AdminProducts implements OnInit {
  products: ProductModel[] = [];
  selectedProduct: any = {};
  readonly staticFilesUrl = environment.staticFilesUrl;

  productDialog: boolean = false;
  submitted: boolean = false;
  loading: boolean = true;
  totalRecords: number = 0;

  private productServise = inject(ProductServise);
  private messageService = inject(MessageService);

  ngOnInit() {
    this.loading = true;
    this.productServise.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.totalRecords = data.length;
        this.loading = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load products' });
        this.loading = false;
      }
    });
  }

  openNew() {
    this.selectedProduct = { ProductsName: '', Price: 0 };
    this.submitted = false;
    this.productDialog = true;
  }

  editProduct(product: ProductModel) {
    this.selectedProduct = { ...product };
    this.productDialog = true;
  }

  hideDialog() {
    this.productDialog = false;
    this.submitted = false;
  }

  saveProduct() {
    this.submitted = true;
    
    if (!this.selectedProduct.ProductsName) {
      return;
    }

    if (this.selectedProduct.ProductsID) {
      this.productServise.updateProduct(this.selectedProduct.ProductsID, this.selectedProduct).subscribe({
        next: (data) => {
          const index = this.products.findIndex(p => p.ProductsID === data.ProductsID);
          if (index !== -1) {
            this.products[index] = data;
          }
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product updated successfully' });
          this.productDialog = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update product' });
        }
      });
    } else {
      this.productServise.createProduct(this.selectedProduct).subscribe({
        next: (data) => {
          this.products.push(data);
          this.totalRecords++;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product created successfully' });
          this.productDialog = false;
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to create product' });
        }
      });
    }
  }

  deleteProduct(product: ProductModel) {
    if (confirm(`Delete ${product.ProductsName}?`)) {
      this.productServise.deleteProduct(product.ProductsID).subscribe({
        next: () => {
          this.products = this.products.filter(p => p.ProductsID !== product.ProductsID);
          this.totalRecords--;
          this.messageService.add({ severity: 'success', summary: 'Success', detail: 'Product deleted successfully' });
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete product' });
        }
      });
    }
  }
}
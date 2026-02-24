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
    this.productDialog = false;
    this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Save functionality to be implemented' });
  }

  deleteProduct(product: ProductModel) {
    if (confirm(`Delete ${product.ProductsName}?`)) {
      this.messageService.add({ severity: 'info', summary: 'Info', detail: 'Delete functionality to be implemented' });
    }
  }
}
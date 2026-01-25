import { Component, Input,OnInit, inject, signal } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ProductModel } from '../../Models/ProductModel';
import { ProductServise } from '../../Servises/ProductServise/product-servise';
import { CategoryModel } from '../../Models/categoryModel';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { CategoryServise } from '../../Servises/categoryServise/category-servise';
import { SliderModule } from 'primeng/slider';
import { environment } from '../../../environments/environment';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';

import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { InputTextModule } from 'primeng/inputtext';
import { EmptyProduct } from '../empty-product/empty-product';

@Component({
  selector: 'app-category',
  imports: [SplitterModule, CurrencyPipe, FormsModule, Checkbox, DataView, ButtonModule,
     Tag, CommonModule, CheckboxModule,SliderModule,SelectModule, FloatLabelModule,
    IconFieldModule, InputIconModule, InputTextModule,EmptyProduct],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})


export class Category implements OnInit {

  productModel!: ProductModel[]
  productService: ProductServise = inject(ProductServise)
  categoryService: CategoryServise = inject(CategoryServise)
  sum: number = 0;
  chosenProducts: boolean[] = [];

  categoryModel!: CategoryModel

  categoryID!: number

  @Input() set id(value: number) {
    this.categoryID = value
    this.loadPage()
  }

  numOfPages: number = 1
  PageSize: number = 24
  search?: string
  minPrice?: number
  MaxPrice?: number
  orderByPrice?: boolean
  desc?: boolean
  errorMessegeBadRequest: string = ''
  errorMessegeStatuse200: string = ''
  staticFilesURL: string = environment.staticFilesUrl
  emptyProductId!:number
  rangeValues: number[] = [0, 100];
 
optionForSorting: string[] | undefined;
selectedSorted: string | undefined;
ngOnInit() {
       this.optionForSorting = [
           'price from low to high',
           'price from high to low'
        ];

      }

  loadPage() {
    this.categoryService.getCategoryByID(this.categoryID).subscribe({
      next: (data => {
        if (data.body === null) {
          this.errorMessegeBadRequest = "faild to load try again later"
          console.log("faild load")
        } else {
          this.categoryModel = data.body
        }

      }),
      error: (err) => {
        this.errorMessegeBadRequest = "faild to load try again later"
        console.log(err);

      }
    })

    
    this.productService.getProduct(this.categoryID, this.numOfPages, this.PageSize).subscribe({
      next: (data) => {
        if (data.body?.data === null) {
          this.errorMessegeStatuse200 = "no items match to your search"
          this.productModel = []
        }
        else {

          this.productModel = data.body?.data ?? []
          this.chosenProducts = []
          for (let i = 0; i < this.productModel.length; i++) {
            this.chosenProducts.push(false);
          }
          const emptyOne = this.productModel.find(obj => {
            obj.ProductsName = "Empty"
          })
          this.emptyProductId=emptyOne!.ProductsID
        }
   
      },
      error: (err) => {
        this.productModel = []
        this.errorMessegeBadRequest = "faild to load try again later"
      
      }

    })


  }

  loadOnFilter(){
    this.MaxPrice=this.rangeValues[1]
    this.minPrice=this.rangeValues[0]
    this.desc=false
    this.orderByPrice=false
if(this.selectedSorted!==undefined)
{
  this.orderByPrice=true
  if(this.selectedSorted==='price from high to low')
  {
   this.desc=true
  }
}


    this.productService.getProduct(this.categoryID, this.numOfPages, this.PageSize,this.search,this.minPrice,this.MaxPrice,this.orderByPrice,this.desc).subscribe({
      next: (data) => {
        if (data.body?.data === null) {
          this.errorMessegeStatuse200 = "no items match to your search"
          this.productModel = []
        }
        else {

          this.productModel = data.body?.data ?? []
          this.chosenProducts = []
          for (let i = 0; i < this.productModel.length; i++) {
            this.chosenProducts.push(false);
          }
          const emptyOne = this.productModel.find(obj => {
            obj.ProductsName = "Empty"
          })
          this.emptyProductId=emptyOne!.ProductsID
        }
   
      },
      error: (err) => {
        this.productModel = []
        this.errorMessegeBadRequest = "faild to load try again later"
      
      }

    })


  }

}


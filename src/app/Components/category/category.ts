import { Component } from '@angular/core';
import { SplitterModule } from 'primeng/splitter';
import { ProductModel } from '../../Models/ProductModel';
import { ProductServise } from '../../Servises/ProductServise/product-servise';
import { CategoryModel } from '../../Models/categoryModel';
import { CurrencyPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Checkbox } from 'primeng/checkbox';
import { inject, signal } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { ButtonModule } from 'primeng/button';
import { Tag } from 'primeng/tag';
import { CommonModule } from '@angular/common';
import { CheckboxModule } from 'primeng/checkbox';
import { CategoryServise } from '../../Servises/categoryServise/category-servise';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-category',
  imports: [SplitterModule, CurrencyPipe, FormsModule, Checkbox, DataView, ButtonModule, Tag, CommonModule, CheckboxModule],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category {
  productModel!: ProductModel[] 
  productService: ProductServise = inject(ProductServise)
  categoryService: CategoryServise = inject(CategoryServise)
  sum: number = 0;
  chosenProducts: boolean[] = [];

  categoryModel!: CategoryModel 

  categoryID: number=100//למחוק שמבצעים ניטוב
  numOfPages: number = 1
  PageSize: number = 24
  search?: string
  minPrice?: number
  MaxPrice?: number
  orderByPrice?: boolean
  desc?: boolean
errorMessegeBadRequest:string=''
errorMessegeStatuse200:string=''
staticFilesURL:string=environment.staticFilesUrl
  ngOnInit() {
    this.categoryService.getCategoryByID(this.categoryID).subscribe({
      next:(data=>{
        if(data.body===null)
        {
          this.errorMessegeBadRequest="faild to load try again later"
            console.log("faild load");
        }else{
            this.categoryModel=data.body
        }
    
      }),
      error:(err) =>{
         this.errorMessegeBadRequest="faild to load try again later"
        console.log(err);
       
      }
    })

//לבדוק אם הפריט ריק ואם כן ליצור עמוד מיוחד שך פריטים רייקים
    this.productService.getProduct(this.categoryID, this.numOfPages,  this.PageSize).subscribe({
      next:(data)=>{
if(data.body?.data===null)
{
  this.errorMessegeStatuse200="no items match to your search"
  this.productModel=[]
}
else{
  this.productModel=data.body?.data??[]
}
      },
      error:(err)=>{
  this.productModel=[]
    this.errorMessegeBadRequest="faild to load try again later"
      }
    })

    for (let i = 0; i < this.productModel.length; i++) {
      this.chosenProducts.push(false);
    }
  }
}

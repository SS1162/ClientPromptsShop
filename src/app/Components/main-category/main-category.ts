import { Component, inject, Input } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { AsyncPipe, CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CategoryModel } from '../../Models/categoryModel';
import { CategoryServise } from '../../Servises/categoryServise/category-servise';
import { CardModule } from 'primeng/card';
import { CascadeSelect } from 'primeng/cascadeselect';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';
import { Message } from 'primeng/message';
import { InputMaskModule } from 'primeng/inputmask';
import { environment } from '../../../environments/environment';
import { PaginatorModule, PaginatorState } from 'primeng/paginator';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-main-category',
  imports: [DataView,
    Tag,
    Rating,
    ButtonModule,
    CardModule,
    CommonModule,
    SelectButton,
    FormsModule,
    Message,
    InputMaskModule,
    PaginatorModule,
    CascadeSelect, InputIcon, IconField, InputTextModule, IconFieldModule, InputIconModule,RouterLink,AsyncPipe],
  providers: [CategoryServise],
  templateUrl: './main-category.html',
  styleUrl: './main-category.scss',
})

export class MainCategory {
  //  orderByArray: string[] =['name','description'];
  //  selectedOrder: any;
  categoryServise = inject(CategoryServise)
  //  layout: 'list' | 'grid' = 'list';
  // options = ['list', 'grid'];
  categoryModel?: CategoryModel[] = []
  searchTerm?: string 
  numberOfPages: number =1
  private mainCategoryID!:number
  @Input() set id(value:number)
  {
    this.mainCategoryID=value;
    this.getCategories()
  }
 
 
  pageSize: number = 24
  totalRecords!:number
  errorMessegeStatus200: string = ''
  errorMessegeBadRequest: string = ''
 staticFilesURL:string=environment.staticFilesUrl

 getCategories(){
   this.categoryServise.getcategory(this.numberOfPages, this.mainCategoryID, this.pageSize).subscribe({
      next: (data) => {
        if (data.status===204) {
           this.categoryModel=[]
          this.errorMessegeStatus200 = "no items match to your search"
  this.totalRecords=0
        }
        else {
          this.categoryModel = data.body?.data;
          console.log(this.categoryModel)
           this.totalRecords=data.body?.totalItems??0
        }
      }
      , error: (error) => {
        this.categoryModel=[]
        this.errorMessegeBadRequest = "faild to load product try again later"
        console.log(error)
      }

    })
 }
 
  changeSearch() {
    if(this.searchTerm==="")
      this.searchTerm=undefined
 this.categoryServise.getcategory(this.numberOfPages, this.mainCategoryID, this.pageSize,this.searchTerm).subscribe({
      next: (data) => {
        if (data.status===204) {
          this.categoryModel=[]
          this.errorMessegeStatus200 = "no items match to your search"
          this.totalRecords=0
        }
        else {
          this.totalRecords=data.body?.totalItems??0
          this.categoryModel = data.body?.data;
        }
      }
      , error: (error) => {
        this.categoryModel=[]
        this.errorMessegeBadRequest = "faild to load product try again later"
        console.log(error)
      }

    })


   }
    onPageChange(event: PaginatorState) {
    this.numberOfPages= this.numberOfPages+1
    if(this.searchTerm ==="")
      this.searchTerm=undefined
 this.categoryServise.getcategory(this.numberOfPages, this.mainCategoryID, this.pageSize,this.searchTerm).subscribe({
      next: (data) => {
        if (data.status===204) {
          this.categoryModel=[]
          this.errorMessegeStatus200 = "no items match to your search"
          this.totalRecords=0
        }
        else {
          this.errorMessegeStatus200=""
          this.errorMessegeBadRequest=""
          this.totalRecords=data.body?.totalItems??0
          this.categoryModel = data.body?.data;
        }
      }
      , error: (error) => {
        this.categoryModel=[]
        this.errorMessegeBadRequest = "faild to load product try again later"
        console.log(error)
      }

    })
}

  }





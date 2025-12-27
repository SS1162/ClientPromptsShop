import { Component, inject } from '@angular/core';
import { DataView } from 'primeng/dataview';
import { Tag } from 'primeng/tag';
import { Rating } from 'primeng/rating';
import { ButtonModule } from 'primeng/button';
import { SelectButton } from 'primeng/selectbutton';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { signal } from '@angular/core';
import { DataViewModule } from 'primeng/dataview';
import { CategoryModel } from '../../Models/categoryModel';
import { CategoryServise } from '../../Servises/categoryServise/category-servise';
import { CardModule } from 'primeng/card';
import { CascadeSelect } from 'primeng/cascadeselect';
import { InputIcon } from 'primeng/inputicon';
import { IconField } from 'primeng/iconfield';
import { InputTextModule } from 'primeng/inputtext';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';


@Component({ 
  selector: 'app-main-category',
  imports: [  DataView,
      Tag,
      Rating,
      ButtonModule,
      CardModule, 
      CommonModule,
      SelectButton,
      FormsModule,
    CascadeSelect,InputIcon, IconField, InputTextModule, IconFieldModule, InputIconModule],
      providers: [CategoryServise],
  templateUrl: './main-category.html',
  styleUrl: './main-category.scss',})

export class MainCategory {
 orderByArray: string[] =['name','description'];
 selectedOrder: any;
categoryServise=inject(CategoryServise)
 layout: 'list' | 'grid' = 'list';
options = ['list', 'grid'];
 categoryModel?:CategoryModel[]=[]
searchTerm:string='';
  async ngOnInit() {
       this.categoryModel=await this.categoryServise.getcategory()
}



}







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

@Component({
  selector: 'app-category',
  imports: [SplitterModule, CurrencyPipe, FormsModule, Checkbox,DataView, ButtonModule, Tag, CommonModule,CheckboxModule],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})
export class Category {
  productModel: ProductModel[]= [
  {
    ProductsID: 1,
    CategoryID: 101,
    ProductsName: 'מחשב נייד עוצמתי',
    CategoryName: 'אלקטרוניקה',
    ImgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg', // לינק זמני לבדיקה
    Price: 3500
  },
  {
    ProductsID: 2,
    CategoryID: 101,
    ProductsName: 'עכבר אלחוטי',
    CategoryName: 'אלקטרוניקה',
    ImgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
    Price: 150
  },
  {
    ProductsID: 3,
    CategoryID: 102,
    ProductsName: 'שולחן כתיבה מעץ',
    CategoryName: 'ריהוט',
    ImgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/game-controller.jpg',
    Price: 850
  },
  {
    ProductsID: 4,
    CategoryID: 102,
    ProductsName: 'כיסא ארגונומי',
    CategoryName: 'ריהוט',
    ImgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/gold-phone-case.jpg',
    Price: 1200
  }
];;
  productService!: ProductServise;
  sum: number = 0;
  chosenProducts: boolean[] = [];

  categoryModel: CategoryModel = {
    categoryID: 3,
    mainCategoryID: 20,
    categoryName: 'אחסון וזיכרון',
    imgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
    categoryDescreption: 'כונני SSD מהירים וכרטיסי זיכרון בנפחים גדולים לשמירה על המידע שלך.'
  }


  ngOnInit() {
    for (let i = 0; i < this.productModel.length; i++) {
      this.chosenProducts.push(false);
    }
  }
}

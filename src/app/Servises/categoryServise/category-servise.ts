import { Injectable } from '@angular/core';
import { CategoryModel } from '../../Models/categoryModel';


@Injectable({
  providedIn: 'root',
})
export class CategoryServise {
  categoryModel?:CategoryModel[]

async getcategory(){
  //http
this.categoryModel=[
  {
    categoryID: 1,
    mainCategoryID: 10,
    categoryName: 'מחשבים ניידים',
    imgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg', // קישור זמני לתמונה
    categoryDescreption: 'מגוון מחשבים חזקים לעבודה ופיתוח מהמותגים המובילים בעולם.'
  },
  {
    categoryID: 2,
    mainCategoryID: 10,
    categoryName: 'ציוד היקפי',
    imgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
    categoryDescreption: 'מקלדות מכאניות, עכברים ארגונומיים ומסכים באיכות גבוהה.'
  },
  {
    categoryID: 3,
    mainCategoryID: 20,
    categoryName: 'אחסון וזיכרון',
    imgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
    categoryDescreption: 'כונני SSD מהירים וכרטיסי זיכרון בנפחים גדולים לשמירה על המידע שלך.'
  }, {
    categoryID: 1,
    mainCategoryID: 10,
    categoryName: 'מחשבים ניידים',
    imgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/bamboo-watch.jpg', // קישור זמני לתמונה
    categoryDescreption: 'מגוון מחשבים חזקים לעבודה ופיתוח מהמותגים המובילים בעולם.'
  },
  {
    categoryID: 2,
    mainCategoryID: 10,
    categoryName: 'ציוד היקפי',
    imgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/black-watch.jpg',
    categoryDescreption: 'מקלדות מכאניות, עכברים ארגונומיים ומסכים באיכות גבוהה.'
  },
  {
    categoryID: 3,
    mainCategoryID: 20,
    categoryName: 'אחסון וזיכרון',
    imgUrl: 'https://primefaces.org/cdn/primeng/images/demo/product/blue-band.jpg',
    categoryDescreption: 'כונני SSD מהירים וכרטיסי זיכרון בנפחים גדולים לשמירה על המידע שלך.'
  }

  
];
  return this.categoryModel
}
}

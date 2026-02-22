import { Component, Input, OnInit, inject, signal } from '@angular/core';
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
import { EmptyCategory } from '../../empty-category/empty-category';
import { PlatformsModel } from '../../Models/PlatformsModel';
import { geminiPromptModel } from '../../Models/geminiPromptModel';
import { PlatformServise } from '../../Servises/PlatformServise/platform-servise';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { UserModel } from '../../Models/UserModel';
import { MessageService } from 'primeng/api';
import { AddToCartModel } from '../../Models/AddToCartModel';
import { CurrencyServise } from '../../Servises/currencyServise/currency-servise';

@Component({
  selector: 'app-category',
  imports: [SplitterModule, CurrencyPipe, FormsModule, Checkbox, DataView, ButtonModule,
    CommonModule, CheckboxModule, SliderModule, SelectModule, FloatLabelModule,
    IconFieldModule, InputIconModule, InputTextModule, EmptyProduct, EmptyCategory],
    providers: [MessageService],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})


export class Category implements OnInit {
  private messageService = inject(MessageService);
  productModel!: ProductModel[]
  productService: ProductServise = inject(ProductServise)
  categoryService: CategoryServise = inject(CategoryServise)
  cartServise: CartServise = inject(CartServise)
  userServise: UserServise = inject(UserServise)
  sum: number = 0;
  chosenProducts: boolean[] = [];
  user?: UserModel;

  categoryModel!: CategoryModel

  categoryID!: number

  selctedPlatform?: PlatformsModel

  @Input() set id(value: number) {
    this.categoryID = value
    this.loadPage()
  }

  numOfPages: number = 1
  isEmpty:boolean=false
  PageSize: number = 24
  search?: string
  minPrice?: number
  MaxPrice?: number
  orderByPrice?: boolean
  desc?: boolean
  errorMessegeBadRequest: string = ''
  errorMessegeStatuse200: string = ''
  staticFilesURL: string = environment.staticFilesUrl
  emptyProductId!: number
  pendingGeminiPrompt: geminiPromptModel | null = null
  rangeValues: number[] = [0, 100];
  platforms: PlatformsModel[] | null = null
  optionForSorting: string[] | undefined;
  selectedSorted: string | undefined;
  platformServise: PlatformServise = inject(PlatformServise)
  currencyServise: CurrencyServise = inject(CurrencyServise)
  currencyCode: string = 'USD';
  currencyRate: number = 1;

  ngOnInit() {
    this.optionForSorting = [
      'price from low to high',
      'price from high to low'
    ];


    this.platformServise.platforms$.subscribe({
      next: (data) => {
        this.platforms = data
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load platforms' });
      }
    })

    this.currencyServise.selectedCurrency$.subscribe({
      next: (c) => {
        this.currencyCode = c.code;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load currency' });
      }
    });

    this.currencyServise.rate$.subscribe({
      next: (r) => {
        this.currencyRate = r;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load exchange rate' });
      }
    });

    this.userServise.user$.subscribe({
      next:(data)=>{
        if (data) { this.user = data; }
      }
      ,error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });

      }
      
    });
  }

  addSelectedToCart() {
    if (!this.user) 
    {
      const productForSession: { productsID: number, platformsID: number }[] = [];
      const selectedItems = this.productModel.filter((_, i) => this.chosenProducts[i]);
      for (const item of selectedItems) {
        productForSession.push({
          productsID: item.ProductsID,
          platformsID: this.selctedPlatform!.platformID
        });
      }
      const existing = JSON.parse(sessionStorage.getItem('pendingCartItems') || '[]');
      sessionStorage.setItem('pendingCartItems', JSON.stringify([...existing, ...productForSession]));
    }
    else{
    const selectedItems = this.productModel.filter((_, i) => this.chosenProducts[i]);
    for (const item of selectedItems) {
      this.cartServise.addCartItem(
        {
          userID: this.user.userID,
          productsID: item.ProductsID,
          platformsID: this.selctedPlatform!.platformID 
        },
        this.user.userID
      );
    }
    if (this.pendingGeminiPrompt && this.emptyProductId) {
      this.cartServise.addCartItem(
        {
          userID: this.user.userID,
          productsID: this.emptyProductId,
          userDescription: this.pendingGeminiPrompt.PromptId.toString(),
          platformsID: this.selctedPlatform?.platformID ?? 1
        },
        this.user.userID
      );
      this.pendingGeminiPrompt = null;
    }
  }
  }

  handleGeminiPrompt(prompt: geminiPromptModel | null) {
    this.pendingGeminiPrompt = prompt;
  }

  loadPage() {
    this.categoryService.getCategoryByID(this.categoryID).subscribe({
      next: (data => {
        if (data.body === null) {
                this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });

        } else {
          this.categoryModel = data.body
          if(this.categoryModel.categoryName.startsWith("Empty"))
            this.isEmpty = true;
        }

      }),
      error: (err) => {
               this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });

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
          const emptyOne = this.productModel.find(obj => obj.ProductsName === 'Empty')
          this.emptyProductId = emptyOne!.ProductsID 
        }

      },
      error: (err) => {
        this.productModel = []
       this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });


      }

    })


  }

  loadOnFilter() {
    this.MaxPrice = this.rangeValues[1]
    this.minPrice = this.rangeValues[0]
    this.desc = false
    this.orderByPrice = false
    if (this.selectedSorted !== undefined) {
      this.orderByPrice = true
      if (this.selectedSorted === 'price from high to low') {
        this.desc = true
      }
    }


    this.productService.getProduct(this.categoryID, this.numOfPages, this.PageSize, this.search, this.minPrice, this.MaxPrice, this.orderByPrice, this.desc).subscribe({
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
          const emptyOne = this.productModel.find(obj => obj.ProductsName === 'Empty')
          this.emptyProductId = emptyOne!.ProductsID 
        }

      },
      error: (err) => {
        this.productModel = []
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });

      }


    })


  }

}


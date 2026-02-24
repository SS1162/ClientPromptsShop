import { Component, Input, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
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
import { EmptyCategory } from '../empty-category/empty-category';
import { PlatformsModel } from '../../Models/PlatformsModel';
import { geminiPromptModel } from '../../Models/geminiPromptModel';
import { PlatformServise } from '../../Servises/PlatformServise/platform-servise';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { UserModel } from '../../Models/UserModel';
import { MessageService } from 'primeng/api';
import { AddToCartModel } from '../../Models/AddToCartModel';
import { CurrencyServise } from '../../Servises/currencyServise/currency-servise';
import { ToastModule } from 'primeng/toast';
import { SessionCartItem } from '../../Servises/cartServise/cart-servise';

@Component({
  selector: 'app-category',
  imports: [SplitterModule, CurrencyPipe, FormsModule, Checkbox, DataView, ButtonModule,
    CommonModule, CheckboxModule, SliderModule, SelectModule, FloatLabelModule,
    IconFieldModule, InputIconModule, InputTextModule, EmptyProduct, EmptyCategory, ToastModule],
    providers: [MessageService],
  templateUrl: './category.html',
  styleUrl: './category.scss',
})


export class Category implements OnInit {
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
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
  emptyProductPrice: number = 0
  emptyProductResetTick: number = 0
  geminiPromptConsumed: boolean = false
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

    this.cartServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (err) => {
        if(!err)
        {
console.log(err)
        }
      },
      error:(err)=>{
        console.log(err)
      }
    })
    this.platformServise.getPlatforms()
    this.platformServise.platforms$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.platforms = data
      },
      error: (err) => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load platforms' });
      }
    })

    this.currencyServise.selectedCurrency$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (c) => {
        this.currencyCode = c.code;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load currency' });
      }
    });

    this.currencyServise.rate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (r) => {
        this.currencyRate = r;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load exchange rate' });
      }
    });

    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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
      const selectedItems = this.productModel.filter((_, i) => this.chosenProducts[i]);
      for (const item of selectedItems) {
        const sessionItem: SessionCartItem = {
          productsID:  (item as any).productsID ?? item.ProductsID,
          platformsID: this.selctedPlatform!.platformID,
          productsName: (item as any).productsName ?? item.ProductsName,
          price:        (item as any).price ?? item.Price,
          platformName: this.selctedPlatform!.platformName,
          imgUrl:       (item as any).imgUrl ?? item.ImgUrl ?? '',
          categoryID:   (item as any).categoryID ?? item.CategoryID,
        };
        this.cartServise.addSessionItem(sessionItem);
      }
      this.cartServise.openPopup();
      this.messageService.add({ severity: 'success', summary: 'Added to cart', detail: 'Selected items have been added to your cart successfully', life: 3000 });
      this.clearChoose()
    }
    else{
    const selectedItems = this.productModel.filter((_, i) => this.chosenProducts[i]);
    for (const item of selectedItems) {
      this.cartServise.addCartItem(
        {
          userID: this.user.userID,
          productsID: (item as any).productsID,
          platformsID: this.selctedPlatform!.platformID 
        },
        this.user.userID
      ).subscribe();
    }
    if (this.pendingGeminiPrompt && this.emptyProductId) {
      this.cartServise.addCartItem(
        {
          userID: this.user.userID,
          productsID: this.emptyProductId,
          userDescription: this.pendingGeminiPrompt.promptId,
          platformsID: this.selctedPlatform!.platformID 
        },
        this.user.userID
      ).subscribe();
      this.pendingGeminiPrompt = null;
      this.geminiPromptConsumed = true;
      setTimeout(() => this.geminiPromptConsumed = false, 0);
    }
    // Open the cart drawer immediately — don't wait for HTTP response
    this.cartServise.openPopup();
    this.messageService.add({ severity: 'success', summary: 'Added to cart', detail: 'Selected items have been added to your cart successfully', life: 3000 });
    this.clearChoose()
  }
  
  }

  clearChoose(){
    for(let i=0;i<this.chosenProducts.length;i++){
      this.chosenProducts[i] = false;
    }
    this.pendingGeminiPrompt = null;
    this.emptyProductResetTick++;
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
         const emptyOne = this.productModel.find(obj => ((obj as any).productsName ?? obj.ProductsName) === 'Empty')
          this.emptyProductId = (emptyOne as any)?.productsID ?? emptyOne?.ProductsID
          this.emptyProductPrice = (emptyOne as any)?.price ?? emptyOne?.Price
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
          const emptyOne = this.productModel.find(obj => ((obj as any).productsName ?? obj.ProductsName) === 'Empty')
          this.emptyProductId = (emptyOne as any)?.productsID ?? emptyOne?.ProductsID
          this.emptyProductPrice = (emptyOne as any)?.price ?? emptyOne?.Price
        }

      },
      error: (err) => {
        this.productModel = []
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });

      }


    })


  }

}


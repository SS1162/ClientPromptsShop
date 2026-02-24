import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { Route, Router, RouterLink } from "@angular/router";
import { UserServise } from '../../Servises/UserServise/User-servise';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CartServise, SessionCartItem } from '../../Servises/cartServise/cart-servise';
import { CartItemModel } from '../../Models/CartItemModel';
import { CardModule } from 'primeng/card';
import { UserModel } from '../../Models/UserModel';
import { BasicSiteModel } from '../../Models/BasicSiteModel';
import { BasicSiteService } from '../../Servises/BasicSiteServise/basic-site.service';
import { CurrencyServise } from '../../Servises/currencyServise/currency-servise';
import { environment } from '../../../environments/environment';
@Component({
  selector: 'app-full-screen-cart',
  imports: [
    CommonModule, ButtonModule, DialogModule, RatingModule, TextareaModule, FileUploadModule, FormsModule, FloatLabelModule,
    RouterLink, ToastModule, RippleModule, CardModule
  ],
  providers: [MessageService],
  templateUrl: './full-screen-cart.html',
  styleUrl: './full-screen-cart.scss',
})

export class FullScreenCart implements OnInit {
  cartItems: CartItemModel[] = []
  sessionItems: SessionCartItem[] = []
  isGuest: boolean = false
  displayReviewDialog: boolean = false;
  cartServise: CartServise = inject(CartServise)
  userServise: UserServise = inject(UserServise)
  private messageService = inject(MessageService);
  router: Router = inject(Router)
  userID!: number | null
  user!:UserModel
  error: string = ""
  noItems: string = ""
  totalPrice: number = 0  
  sessionTotal: number = 0
  basicSite?: BasicSiteModel
  basicSiteServise: BasicSiteService = inject(BasicSiteService)
  currencyServise: CurrencyServise = inject(CurrencyServise)
  currencyCode: string = 'USD';
  currencyRate: number = 1;
  BASIC_IMG = environment.staticFilesUrl;
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.currencyServise.selectedCurrency$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => {
      this.currencyCode = c.code;
    });

    this.currencyServise.rate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => {
      this.currencyRate = r;
    });

    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.error = ""
        if (data !== null) {
          this.isGuest = false
          this.userID = data.userID
          this.cartServise.getUserCart(this.userID)
          this.user = data

          if (this.user.basicID) {
            this.basicSiteServise.getBasicSites(this.user.basicID)
            this.basicSiteServise.basicSites$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
              next: (siteData) => { if (siteData) { this.basicSite = siteData } },
              error: () => { this.error = "Failed to load site data"; this.showError() }
            })
          }
        } else {
          // Guest: show session cart instead of redirecting
          this.isGuest = true
        }
      },
      error: () => {
        this.error = "An error occurred while trying to load the product. Please try again later"
        this.showError()
      }
    })

    this.cartServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (err) => {
        if (err !== null) {
          this.error = "An error occurred while trying to load the product. Please try again later"
          this.showError()
        }
      },
      error: () => {
        this.error = "An error occurred while trying to load the product. Please try again later"
        this.showError()
      }
    })

    this.cartServise.cartItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.error = ""
        if (data === null) {
          this.noItems = "Every great creation begins with a single prompt. Your cart is waiting for the next big idea."
        } else {
          this.noItems = ""
          this.cartItems = data
          this.totalPrice = data.filter(item => item.valid).reduce((sum, item) => sum + item.price, 0)
        }
      },
      error: () => {
        this.error = "An error occurred while trying to load the product. Please try again later"
        this.showError()
      }
    })

    this.cartServise.sessionCart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items => {
      this.sessionItems = items
      this.sessionTotal = items.reduce((sum, i) => sum + i.price, 0)
    })
  }

  get validCartItemsCount(): number {
    return this.cartItems.filter(item => item.valid).length;
  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
  }

changeProductToValid(cartId:number){
  this.cartServise.changeProductToValid(cartId,this.user.userID)
}
changeProductToInValid(cartId:number){
  this.cartServise.changeProductToInValid(cartId,this.user.userID)
}
  
removeProduct(cartId:number){
  this.cartServise.removeCartItem(cartId,this.user.userID)
}

removeSessionItem(index: number) {
  this.cartServise.removeSessionItem(index)
}

goToLogin() {
  this.router.navigate(['/login'])
}

goToPaiment(){}

}
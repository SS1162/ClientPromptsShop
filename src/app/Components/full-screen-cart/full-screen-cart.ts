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
import { UserService } from '../../Services/user/user.service';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CartService, SessionCartItem } from '../../Services/cart/cart.service';
import { CartItemModel } from '../../Models/CartItemModel';
import { CardModule } from 'primeng/card';
import { UserModel } from '../../Models/UserModel';
import { BasicSiteModel } from '../../Models/BasicSiteModel';
import { BasicSiteService } from '../../Services/basic-site/basic-site.service';
import { CurrencyService } from '../../Services/currency/currency.service';
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
  cartService: CartService = inject(CartService)
  userService: UserService = inject(UserService)
  private messageService = inject(MessageService);
  router: Router = inject(Router)
  userID!: number | null
  user!:UserModel
  error: string = ""
  noItems: string = ""
  totalPrice: number = 0  
  sessionTotal: number = 0
  basicSite?: BasicSiteModel
  basicSiteService: BasicSiteService = inject(BasicSiteService)
  currencyService: CurrencyService = inject(CurrencyService)
  currencyCode: string = 'USD';
  currencyRate: number = 1;
  BASIC_IMG = environment.staticFilesUrl;
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    this.currencyService.selectedCurrency$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => {
      this.currencyCode = c.code;
    });

    this.currencyService.rate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => {
      this.currencyRate = r;
    });

    this.userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        this.error = ""
        if (data !== null) {
          this.isGuest = false
          this.userID = data.userID
          this.cartService.getUserCart(this.userID)
          this.user = data

          if (this.user.basicID) {
            this.basicSiteService.getBasicSites(this.user.basicID)
            this.basicSiteService.basicSites$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    this.cartService.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    this.cartService.cartItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    this.cartService.sessionCart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items => {
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
  this.cartService.changeProductToValid(cartId,this.user.userID)
}
changeProductToInValid(cartId:number){
  this.cartService.changeProductToInValid(cartId,this.user.userID)
}
  
removeProduct(cartId:number){
  this.cartService.removeCartItem(cartId,this.user.userID)
}

removeSessionItem(index: number) {
  this.cartService.removeSessionItem(index)
}

goToLogin() {
  this.router.navigate(['/login'])
}

goToPaiment(){}

}
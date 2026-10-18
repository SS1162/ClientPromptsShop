import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartService, SessionCartItem } from '../../Services/cart/cart.service';
import { UserService } from '../../Services/user/user.service';
import { CartItemModel } from '../../Models/CartItemModel';
import { UserModel } from '../../Models/UserModel';
import { CurrencyService } from '../../Services/currency/currency.service';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pop-cart',
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './pop-cart.html',
  styleUrl: './pop-cart.scss',
})
export class PopCart implements OnInit {
  cartService: CartService = inject(CartService);
  userService: UserService = inject(UserService);
  router: Router = inject(Router);
  currencyService: CurrencyService = inject(CurrencyService);
  private destroyRef = inject(DestroyRef);

  isOpen: boolean = false;
  cartItems: CartItemModel[] = [];
  sessionItems: SessionCartItem[] = [];
  isGuest: boolean = false;
  totalPrice: number = 0;
  user!: UserModel;
  currencyCode: string = 'USD';
  currencyRate: number = 1;
  BASIC_IMAGE_URL:string=environment.staticFilesUrl 

  ngOnInit() {
    this.cartService.popupOpen$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(open => {
      this.isOpen = open;
    });

    this.currencyService.selectedCurrency$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => {
      this.currencyCode = c.code;
    });

    this.currencyService.rate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => {
      this.currencyRate = r;
    });

    this.userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (data) {
        this.isGuest = false;
        this.user = data;
        this.cartService.getUserCart(data.userID);
      } else {
        this.isGuest = true;
      }
    });

    this.cartService.cartItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (data) {
        this.cartItems = data;
        this.totalPrice = data.reduce((sum, item) => sum + item.price, 0);
      } else {
        this.cartItems = [];
        this.totalPrice = 0;
      }
    });

    this.cartService.sessionCart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items => {
      this.sessionItems = items;
      if (this.isGuest) {
        this.totalPrice = items.reduce((sum, i) => sum + i.price, 0);
      }
    });
  }

  close() {
    this.cartService.closePopup();
  }

  removeProduct(cartId: number) {
    this.cartService.removeCartItem(cartId, this.user.userID);
  }

  removeSessionItem(index: number) {
    this.cartService.removeSessionItem(index);
  }

  changeProductToValid(cartId: number) {
    this.cartService.changeProductToValid(cartId, this.user.userID);
  }

  changeProductToInValid(cartId: number) {
    this.cartService.changeProductToInValid(cartId, this.user.userID);
  }

  goToFullCart() {
    this.close();
    this.router.navigate(['/fullScreenCart']);
  }

  goToLogin() {
    this.close();
    this.router.navigate(['/login']);
  }
}

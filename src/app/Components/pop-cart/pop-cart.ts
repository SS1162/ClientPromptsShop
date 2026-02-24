import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartServise, SessionCartItem } from '../../Servises/cartServise/cart-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { CartItemModel } from '../../Models/CartItemModel';
import { UserModel } from '../../Models/UserModel';
import { CurrencyServise } from '../../Servises/currencyServise/currency-servise';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-pop-cart',
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './pop-cart.html',
  styleUrl: './pop-cart.scss',
})
export class PopCart implements OnInit {
  cartServise: CartServise = inject(CartServise);
  userServise: UserServise = inject(UserServise);
  router: Router = inject(Router);
  currencyServise: CurrencyServise = inject(CurrencyServise);
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
    this.cartServise.popupOpen$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(open => {
      this.isOpen = open;
    });

    this.currencyServise.selectedCurrency$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => {
      this.currencyCode = c.code;
    });

    this.currencyServise.rate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => {
      this.currencyRate = r;
    });

    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (data) {
        this.isGuest = false;
        this.user = data;
        this.cartServise.getUserCart(data.userID);
      } else {
        this.isGuest = true;
      }
    });

    this.cartServise.cartItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (data) {
        this.cartItems = data;
        this.totalPrice = data.reduce((sum, item) => sum + item.price, 0);
      } else {
        this.cartItems = [];
        this.totalPrice = 0;
      }
    });

    this.cartServise.sessionCart$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(items => {
      this.sessionItems = items;
      if (this.isGuest) {
        this.totalPrice = items.reduce((sum, i) => sum + i.price, 0);
      }
    });
  }

  close() {
    this.cartServise.closePopup();
  }

  removeProduct(cartId: number) {
    this.cartServise.removeCartItem(cartId, this.user.userID);
  }

  removeSessionItem(index: number) {
    this.cartServise.removeSessionItem(index);
  }

  changeProductToValid(cartId: number) {
    this.cartServise.changeProductToValid(cartId, this.user.userID);
  }

  changeProductToInValid(cartId: number) {
    this.cartServise.changeProductToInValid(cartId, this.user.userID);
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

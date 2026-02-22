import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { CartItemModel } from '../../Models/CartItemModel';
import { UserModel } from '../../Models/UserModel';
import { CurrencyServise } from '../../Servises/currencyServise/currency-servise';

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

  isOpen: boolean = false;
  cartItems: CartItemModel[] = [];
  totalPrice: number = 0;
  user!: UserModel;
  currencyCode: string = 'USD';
  currencyRate: number = 1;

  ngOnInit() {
    this.cartServise.popupOpen$.subscribe(open => {
      this.isOpen = open;
    });

    this.currencyServise.selectedCurrency$.subscribe(c => {
      this.currencyCode = c.code;
    });

    this.currencyServise.rate$.subscribe(r => {
      this.currencyRate = r;
    });

    this.userServise.user$.subscribe(data => {
      if (data) {
        this.user = data;
        this.cartServise.getUserCart(data.userID);
      }
    });

    this.cartServise.cartItems$.subscribe(data => {
      if (data) {
        this.cartItems = data;
        this.totalPrice = data.reduce((sum, item) => sum + item.price, 0);
      } else {
        this.cartItems = [];
        this.totalPrice = 0;
      }
    });
  }

  close() {
    this.cartServise.closePopup();
  }

  removeProduct(cartId: number) {
    this.cartServise.removeCartItem(cartId, this.user.userID);
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
}

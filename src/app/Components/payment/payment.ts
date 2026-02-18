import { Component, inject, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { DividerModule } from 'primeng/divider';
import { MessageService } from 'primeng/api';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { CartItemModel } from '../../Models/CartItemModel';
import { UserModel } from '../../Models/UserModel';

@Component({
  selector: 'app-payment',
  imports: [CommonModule, ButtonModule, CardModule, ToastModule, DividerModule, RouterLink, CurrencyPipe],
  providers: [MessageService],
  templateUrl: './payment.html',
  styleUrl: './payment.scss',
})
export class Payment implements OnInit {
  cartItems: CartItemModel[] = [];
  validItems: CartItemModel[] = [];
  totalPrice = 0;
  user!: UserModel;
  loaded = false;
  isProcessing = false;

  private cartServise = inject(CartServise);
  private userServise = inject(UserServise);
  private messageService = inject(MessageService);
  private router = inject(Router);

  ngOnInit() {
    this.userServise.user$.subscribe({
      next: (data) => {
        if (data !== null) {
          this.user = data;
          this.cartServise.getUserCart(data.userID);
        } else {
          this.router.navigate(['/login']);
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: 'Sorry, something went wrong. Please try again.', life: 3000 });
      }
    });

    this.cartServise.cartItems$.subscribe({
      next: (data) => {
        if (data) {
          this.cartItems = data;
          this.validItems = data.filter(i => i.valid === 1);
          this.totalPrice = this.validItems.reduce((sum, i) => sum + i.price, 0);
        }
        this.loaded = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: 'Sorry, something went wrong. Please try again.', life: 3000 });
        this.loaded = true;
      }
    });
  }

  payWithPayPal() {
    this.isProcessing = true;
    // PayPal SDK integration point
    setTimeout(() => {
      this.messageService.add({ severity: 'info', summary: 'PayPal', detail: 'Redirecting to PayPal...', life: 3000 });
      this.isProcessing = false;
    }, 1500);
  }
}

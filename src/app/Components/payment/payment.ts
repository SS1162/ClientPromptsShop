import { Component, inject, OnInit, DestroyRef, AfterViewInit } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
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
import { CurrencyServise } from '../../Servises/currencyServise/currency-servise';
import { environment } from '../../../environments/environment';
import { PaymentServise } from '../../Servises/paymentServise/payment-servise';

declare var paypal: any;

@Component({
  selector: 'app-payment',
  standalone: true,
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
  currencyCode: string = 'USD';
  currencyRate: number = 1;
  staticFilesUrl = environment.staticFilesUrl;

  private cartServise = inject(CartServise);
  private userServise = inject(UserServise);
  private messageService = inject(MessageService);
  private router = inject(Router);
  private currencyServise = inject(CurrencyServise);
  private destroyRef = inject(DestroyRef);
  private paymentServise = inject(PaymentServise);

  ngOnInit() {
    this.currencyServise.selectedCurrency$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(c => {
    this.currencyCode = c.code;
      // אם הכפתור כבר קיים, נצטרך לרנדר אותו מחדש בשינוי מטבע (אופציונלי)
    });

    this.currencyServise.rate$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(r => {
      this.currencyRate = r;
    });

    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
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

    this.cartServise.cartItems$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          this.cartItems = data;
          this.validItems = data.filter(i => !!i.valid);
          this.totalPrice = this.validItems.reduce((sum, i) => sum + i.price, 0);
          
          // ברגע שיש לנו מחיר ופריטים, נטען את פייפאל
          if (this.totalPrice > 0 && !this.isProcessing) {
            this.loadPayPalScript();
          }
        }
        this.loaded = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Something went wrong', detail: 'Sorry, something went wrong. Please try again.', life: 3000 });
        this.loaded = true;
      }
    });
  }

  // טעינה דינמית של הסקריפט כדי להשתמש ב-Client ID מה-environment
  private loadPayPalScript() {
    this.isProcessing = true;
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${environment.paypalClientId}&currency=${this.currencyCode}`;
    script.onload = () => {
      this.renderPayPalButtons();
    };
    document.head.appendChild(script);
  }

  private renderPayPalButtons() {
    paypal.Buttons({
      style: {
        layout: 'vertical',
        color: 'blue',
        shape: 'pill',
        label: 'paypal'
      },
      createOrder: () => {
        const finalAmount = (this.totalPrice * this.currencyRate).toFixed(2);
        const products = this.validItems.map(i => ({
          userID: this.user.userID,
          productsID: i.productID,
          platformsID: i.platformID,
          userDescription: i.userDescreptionID ?? null
        }));
        return firstValueFrom(this.paymentServise.createOrder(finalAmount, this.currencyCode, products))
          .then(res => res.id);
      },
      onApprove: (data: any) => {
        // Build the payload that matches the backend OrdersDTO
        const orderPayload = {
          userID: this.user.userID,
          orderSum: this.totalPrice,
          basicID: this.user.basicID,
          products: this.validItems.map(i => ({
            userID: this.user.userID,
            productsID: i.productID,
            platformsID: i.platformID,
            userDescription: i.userDescreptionID ?? null
          }))
        };

        this.paymentServise.captureOrder(data.orderID, orderPayload).subscribe({
          next: (createdOrder) => {
            this.messageService.add({
              severity: 'success',
              summary: 'Payment Success',
              detail: `Thank you! Your order #${createdOrder.orderID} is confirmed.`
            });
            this.router.navigate(['/paymentSuccess']);
          },
          error: () => {
            this.messageService.add({
              severity: 'error',
              summary: 'Order Failed',
              detail: 'Payment was captured but the order could not be saved. Please contact support.'
            });
          }
        });
      },
      onError: (err: any) => {
        this.messageService.add({ 
          severity: 'error', 
          summary: 'PayPal Error', 
          detail: 'The payment process could not be completed.' 
        });
        console.error('PayPal Error:', err);
      }
    }).render('#paypal-button-container');
    this.isProcessing = false;
  }
}
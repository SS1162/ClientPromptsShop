import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { OrderServise } from '../../Servises/orderServise/order-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';

@Component({
  selector: 'app-payment-success',
  standalone: true,
  imports: [CommonModule, ButtonModule, RouterLink],
  templateUrl: './payment-success.html',
  styleUrl: './payment-success.scss',
})
export class PaymentSuccess implements OnInit {
  private orderService: OrderServise = inject(OrderServise);
  private userServise: UserServise = inject(UserServise);
  private destroyRef = inject(DestroyRef);

  orderNumber: number = 0;
  orderDate: string = new Date().toLocaleDateString();

  ngOnInit() {
    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        if (user) {
          this.orderService.getUserOrders(user.userID);
        }
      }
    });

    this.orderService.orders$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (orders) => {
        if (orders && orders.length > 0) {
          const lastOrder = orders[orders.length - 1];
          this.orderNumber = lastOrder.orderID;
          this.orderDate = lastOrder.orderDate || this.orderDate;
        }
      }
    });
  }
}

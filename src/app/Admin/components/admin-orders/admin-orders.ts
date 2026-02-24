import { Component, OnInit, inject, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { take, skip } from 'rxjs';
import { Router } from '@angular/router';
import { MessageService } from 'primeng/api';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { DialogModule } from 'primeng/dialog';
import { SelectModule } from 'primeng/select';
import { ToastModule } from 'primeng/toast';
import { OrderServise } from '../../../Servises/orderServise/order-servise';
import { UserServise } from '../../../Servises/UserServise/User-servise';
import { OrderDetailsModel } from '../../../Models/OrderDetailsModel ';
import { FullOrderModel } from '../../../Models/FullOrderModet';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-admin-orders',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TableModule,
    ButtonModule,
    TagModule,
    DialogModule,
    SelectModule,
    ToastModule
  ],
  providers: [MessageService],
  templateUrl: './admin-orders.html',
  styleUrl: './admin-orders.scss',
})
export class AdminOrders implements OnInit {
  private orderServise: OrderServise = inject(OrderServise);
  private userServise: UserServise = inject(UserServise);
  private router = inject(Router);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  orders: FullOrderModel[] = [];
  filteredOrders: FullOrderModel[] = [];
  selectedOrder: any = null;
  orderDetailsDialog = false;
  loading = true;
  selectedStatus = 'all';

  statusOptions = [
    { label: 'All', value: 'all' },
    { label: 'Pending', value: 'pending' },
    { label: 'Processing', value: 'processing' },
    { label: 'Completed', value: 'completed' },
    { label: 'Cancelled', value: 'cancelled' }
  ];

  ngOnInit() {
    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        if (user) {
          this.orderServise.getAllOrders();
        } else {
          this.router.navigate(['/login']);
        }
      }
    });

    this.orderServise.orders$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          this.orders = data;
          this.filterOrders();
          this.loading = false;
        }
      }
    });

    this.orderServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load orders' });
          this.loading = false;
        }
      }
    });
  }

  filterOrders() {
    if (this.selectedStatus === 'all') {
      this.filteredOrders = [...this.orders];
    } else {
      const statusMap: { [key: string]: string } = { pending: 'Pending', processing: 'Processing', completed: 'Completed', cancelled: 'Cancelled' };
      const statusName = statusMap[this.selectedStatus];
      this.filteredOrders = this.orders.filter(o => o.statusName === statusName);
    }
  }

  viewOrderDetails(order: FullOrderModel) {
    this.orderServise.orderDetails$.pipe(
      skip(1),
      take(1)
    ).subscribe({
      next: (details) => {
        if (details) {
          this.selectedOrder = details;
          this.orderDetailsDialog = true;
        }
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load order details' });
      }
    });
    this.orderServise.getOrderDetails(order.orderID);
  }

  hideDialog() {
    this.orderDetailsDialog = false;
    this.selectedOrder = null;
  }

  getStatusSeverity(status: string): 'success' | 'secondary' | 'info' | 'warn' | 'danger' | 'contrast' | null | undefined {
    const statusLower = status?.toLowerCase();
    switch (statusLower) {
      case 'completed': return 'success';
      case 'processing': return 'info';
      case 'pending': return 'warn';
      case 'cancelled': return 'danger';
      default: return 'secondary';
    }
  }

  formatDate(dateString?: string): string {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  }
}

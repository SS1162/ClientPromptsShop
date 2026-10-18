import { Component, OnInit, inject, signal, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { UserService } from '../../../Services/user/user.service';
import { OrderService } from '../../../Services/order/order.service';
import { UserModel } from '../../../Models/UserModel';
import { FullOrderModel } from '../../../Models/FullOrderModel';

@Component({
  selector: 'app-admin-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './admin-dashboard.html',
  styleUrls: ['./admin-dashboard.scss']
})
export class AdminDashboard implements OnInit {
  private userService: UserService = inject(UserService);
  private orderService: OrderService = inject(OrderService);
  private router: Router = inject(Router);
  private destroyRef = inject(DestroyRef);

  public user: UserModel | null = null;
  public loading = true;
  public stats = signal<any[]>([]);
  public recentOrders = signal<any[]>([]);

  ngOnInit() {
    this.userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (user) => {
        if (!user) {
          this.router.navigate(['/login']);
          return;
        }
        this.user = user;
        this.orderService.getAllOrders();
      }
    });

    this.orderService.orders$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (orders) => {
        if (!orders) return;
        this.buildStats(orders);
        this.recentOrders.set(orders.slice(0, 5));
        this.loading = false;
      }
    });

    this.orderService.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (err) => {
        if (err) {
          console.error('Error loading dashboard data:', err);
          this.loading = false;
        }
      }
    });
  }

  private buildStats(orders: FullOrderModel[]) {
    const totalRevenue = orders.reduce((sum, o) => sum + (o.orderSum || 0), 0);
    const pendingOrders = orders.filter(o => o.statusName === 'Pending').length;
    const openOrders = orders.filter(o => o.statusName === 'Pending' || o.statusName === 'Processing').length;

    this.stats.set([
      {
        title: 'Total Revenue',
        value: `$${totalRevenue.toFixed(2)}`,
        icon: 'pi pi-dollar',
        color: 'from-green-500 to-emerald-500',
        link: '/admin/orders'
      },
      {
        title: 'Total Orders',
        value: orders.length,
        subtitle: `${pendingOrders} pending`,
        icon: 'pi pi-shopping-cart',
        color: 'from-blue-500 to-cyan-500',
        link: '/admin/orders'
      },
      {
        title: 'Open Orders',
        value: openOrders,
        subtitle: 'Need attention',
        icon: 'pi pi-exclamation-circle',
        color: 'from-yellow-500 to-orange-500',
        link: '/admin/orders'
      }
    ]);
  }
}

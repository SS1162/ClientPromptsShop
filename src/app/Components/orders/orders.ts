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
import { RouterLink } from '@angular/router';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { OrderServise } from '../../Servises/orderServise/order-servise';
import { ReviewServise } from '../../Servises/ReviewServise/review-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { OrderDetailsModel } from '../../Models/OrderDetailsModel ';
import { AddReviewModel } from '../../Models/AddReviewModel';
import { UserModel } from '../../Models/UserModel';

@Component({
  selector: 'app-orders',
  imports: [
    CommonModule, ButtonModule, DialogModule, RatingModule, TextareaModule,
    FileUploadModule, FormsModule, FloatLabelModule, RouterLink, ToastModule, ProgressSpinnerModule
  ],
  providers: [MessageService],
  templateUrl: './orders.html',
  styleUrl: './orders.scss',
})
export class Orders implements OnInit {
  private orderService: OrderServise = inject(OrderServise);
  private reviewServise: ReviewServise = inject(ReviewServise);
  private userServise: UserServise = inject(UserServise);
  private messageService: MessageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);

  orders: any[] = [];
  user!: UserModel;
  displayReviewDialog: boolean = false;
  selectedOrder: OrderDetailsModel | null = null;

  newReview = { stars: 5, text: '', image: '' };

  ngOnInit() {
    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          this.user = data;
          this.orderService.getUserOrders(data.userID);
        }
      },
      error:(err)=>
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user data.', life: 3000 });
      }
    });

    this.orderService.orders$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          this.orders = data.map(order => ({ ...order, isExpanded: false, isLoadingDetails: false }));
          // Auto-fetch details for each order to populate site name, items and review status
          this.orders.forEach(order => {
            this.orderService.fetchOrderDetails(order.orderID).subscribe({
              next: (details: OrderDetailsModel) => {
                order.details = details;
                order.reviewId = details.reviewId ?? 0;
              },
              error: () => {}
            });
          });
        }
      },
       error:(err)=>
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.', life: 3000 });
      }
    });

    this.orderService.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.', life: 3000 });
        }
      },
      error:()=>{
 this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.', life: 3000 })
      }
    });

    this.reviewServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save review.', life: 3000 });
        }
      }
    });

    this.reviewServise.reviewSaved$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.displayReviewDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Review saved successfully', life: 3000 });
      }
    });
  }

  onFileSelect(event: any) {
    this.newReview.image = 'assets/demo-path.png';
  }

  toggleExpand(order: any) {
    if (order.isExpanded) {
      order.isExpanded = false;
      return;
    }
    // If details already loaded, just expand
    if (order.details) {
      order.isExpanded = true;
      return;
    }
    // Lazy-load details from server
    order.isLoadingDetails = true;
    this.orderService.fetchOrderDetails(order.orderID).subscribe({
      next: (details: OrderDetailsModel) => {
        order.details = details;
        order.isExpanded = true;
        order.isLoadingDetails = false;
      },
      error: () => {
        order.isLoadingDetails = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load order details.', life: 3000 });
      }
    });
  }

  openReview(order: any) {
    // Normalize: FullOrderModel uses orderID, OrderDetailsModel uses orderID
    this.selectedOrder = { ...order, orderID: order.orderID ?? order.orderId };
    if (order.reviewId && order.reviewId > 0) {
      this.newReview = {
        stars: order.details?.stars || 5,
        text: order.details?.note || '',
        image: order.details?.reviewImg || ''
      };
    } else {
      this.newReview = { stars: 5, text: '', image: '' };
    }
    this.displayReviewDialog = true;
  }

  downloadPrompt(order: any) {
    const prompt = order.details?.Prompt;
    if (!prompt) {
      this.messageService.add({ severity: 'warn', summary: 'Not Available', detail: 'No prompt found for this order.', life: 3000 });
      return;
    }
    const blob = new Blob([prompt], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${order.details?.siteName || 'prompt'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  saveReview() {
    if (!this.selectedOrder || !this.user) return;
    const reviewData: AddReviewModel = {
      orderId: this.selectedOrder.orderID,
      score: this.newReview.stars,
      note: this.newReview.text,
      reviewImageUrl: this.newReview.image
    };
    this.reviewServise.saveOrderReview(
      this.selectedOrder.orderID,
      reviewData,
      () => this.orderService.getUserOrders(this.user.userID)
    );
  }
}
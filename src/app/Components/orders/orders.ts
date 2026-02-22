import { Component, inject, OnInit } from '@angular/core';
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
    FileUploadModule, FormsModule, FloatLabelModule, RouterLink, ToastModule
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

  orders: any[] = [];
  user!: UserModel;
  displayReviewDialog: boolean = false;
  selectedOrder: OrderDetailsModel | null = null;

  newReview = { stars: 5, text: '', image: '' };

  ngOnInit() {
    this.userServise.user$.subscribe({
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

    this.orderService.orders$.subscribe({
      next: (data) => {
        if (data) {
          this.orders = data.map(order => ({ ...order, isExpanded: false }));
        }
      },
       error:(err)=>
      {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.', life: 3000 });
      }
    });

    this.orderService.error$.subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.', life: 3000 });
        }
      },
      error:()=>{
 this.messageService.add({ severity: 'error', summary: 'Error', detail: 'An error occurred. Please try again.', life: 3000 })
      }
    });

    this.reviewServise.error$.subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to save review.', life: 3000 });
        }
      }
    });

    this.reviewServise.reviewSaved$.subscribe({
      next: () => {
        this.displayReviewDialog = false;
        this.messageService.add({ severity: 'success', summary: 'Saved', detail: 'Review saved successfully', life: 3000 });
      }
    });
  }

  onFileSelect(event: any) {
    this.newReview.image = 'assets/demo-path.png';
  }

  openReview(order: any) {
    this.selectedOrder = order;
    if (order.reviewId > 0) {
      this.newReview = {
        stars: order.score || 5,
        text: order.note || '',
        image: order.reviewImageUrl || ''
      };
    } else {
      this.newReview = { stars: 5, text: '', image: '' };
    }
    this.displayReviewDialog = true;
  }

  saveReview() {
    if (!this.selectedOrder || !this.user) return;
    const reviewData: AddReviewModel = {
      orderId: this.selectedOrder.orderId,
      score: this.newReview.stars,
      note: this.newReview.text,
      reviewImageUrl: this.newReview.image
    };
    this.reviewServise.saveOrderReview(
      this.selectedOrder.orderId,
      reviewData,
      () => this.orderService.getUserOrders(this.user.userID)
    );
  }
}
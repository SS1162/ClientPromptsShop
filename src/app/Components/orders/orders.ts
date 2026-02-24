import { Component, inject, OnInit, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import emailjs from '@emailjs/browser';
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
  displayViewReviewDialog: boolean = false;
  selectedOrder: OrderDetailsModel | null = null;
  selectedViewReview: { stars: number; text: string; image: string } | null = null;

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
          this.orders = data.map(order => ({
            ...order,
            reviewId: order.ReviewId ?? (order as any).reviewId ?? null,
            isExpanded: false,
            isLoadingDetails: false,
            isDownloading: false
          }));
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
    // If details already loaded AND prompt exists, just expand
    if (order.details?.prompt) {
      order.isExpanded = true;
      return;
    }
    // Lazy-load details from server
    order.isLoadingDetails = true;
    this.orderService.fetchOrderDetails(order.orderID).subscribe({
      next: (details: OrderDetailsModel) => {
        order.details = details;
        order.reviewId = (details as any).reviewId ?? (details as any).ReviewId ?? order.reviewId;
        order.isExpanded = true;
        order.isLoadingDetails = false;
      },
      error: () => {
        order.isLoadingDetails = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load order details.', life: 3000 });
      }
    });
  }

  viewReview(order: any) {
    order.isLoadingDetails = true;
    this.orderService.fetchOrderDetails(order.orderID).subscribe({
      next: (details: any) => {
        order.details = details;
        order.isLoadingDetails = false;
        this.selectedViewReview = {
          stars: details.stars ?? details.Stars ?? 0,
          text: details.note ?? details.Note ?? details.reviewNote ?? details.ReviewNote ?? '',
          image: details.reviewImg ?? details.ReviewImg ?? details.reviewImageUrl ?? details.ReviewImageUrl ?? ''
        };
        this.displayViewReviewDialog = true;
      },
      error: () => {
        order.isLoadingDetails = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load review.', life: 3000 });
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

  private triggerDownload(promptText: string, filename: string) {
    const blob = new Blob([promptText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${filename}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  }

  private async sendEmail(promptText: string, siteName: string) {
    try {
      const templateParams = {
        from_name:'s058329162@gmail.com' ,
        from_email: this.user!.userName,
        from_phone: this.user?.phone || '',
        subject: `Design Prompt — ${siteName}`,
        message: promptText,
        to_email: this.user!.userName
      };

      await emailjs.send(
        'gmail_service',
        'template_5ypz4em',
        templateParams,
        'Jxe0Vhystdvy0tqUk'
      );
      this.messageService.add({ severity: 'success', summary: 'Email Sent', detail: 'The prompt has been sent to your email.', life: 3000 });
    } catch (error) {
      this.messageService.add({ severity: 'warn', summary: 'Email Failed', detail: 'Prompt downloaded but the email could not be sent.', life: 3000 });
    }
  }

  downloadPrompt(order: any) {
    const siteName = order.details?.siteName || order.siteName || 'prompt';

    // If prompt already loaded locally, download + email immediately
    if (order.details?.prompt) {
      this.triggerDownload(order.details.prompt, siteName);
      this.sendEmail(order.details.prompt, siteName);
      return;
    }

    order.isDownloading = true;

    // First fetch details to check if prompt exists on the server
    this.orderService.fetchOrderDetails(order.orderID).subscribe({
      next: (details: OrderDetailsModel) => {
        order.details = details;
        order.reviewId = (details as any).reviewId ?? (details as any).ReviewId ?? order.reviewId;

        if (details.prompt) {
          // Prompt already exists — download it
          order.isDownloading = false;
          this.triggerDownload(details.prompt, details.siteName || siteName);
          this.sendEmail(details.prompt, details.siteName || siteName);
        } else {
          // No prompt yet — generate it; server returns the prompt string directly
          this.orderService.generatePrompt(order.orderID).subscribe({
            next: (promptText: string) => {
              order.isDownloading = false;
              if (promptText) {
                order.details.prompt = promptText;
                this.triggerDownload(promptText, details.siteName || siteName);
                this.sendEmail(promptText, details.siteName || siteName);
              } else {
                this.messageService.add({ severity: 'warn', summary: 'Not Available', detail: 'Prompt could not be generated.', life: 3000 });
              }
            },
            error: () => {
              order.isDownloading = false;
              this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate prompt.', life: 3000 });
            }
          });
        }
      },
      error: () => {
        order.isDownloading = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load order details.', life: 3000 });
      }
    });
  }

  saveReview() {
    if (!this.selectedOrder || !this.user) return;
    const reviewData: AddReviewModel = {
      orderId: this.selectedOrder.orderID,
      score: this.newReview.stars,
      Note: this.newReview.text,
      reviewImageUrl: this.newReview.image
    };
    this.reviewServise.saveOrderReview(
      this.selectedOrder.orderID,
      reviewData,
      () => this.orderService.getUserOrders(this.user.userID)
    );
  }
}
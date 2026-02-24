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
import { environment } from '../../../environments/environment';
import { UserModel } from '../../Models/UserModel';
import { jsPDF } from "jspdf";
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
  newReview: { stars: number; text: string; image: File | null } = { stars: 5, text: '', image: null };

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
    const file: File = event.files?.[0] ?? event.currentFiles?.[0];
    if (file) this.newReview.image = file;
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
        order.reviewId = details.reviewId ?? order.reviewId;
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
      next: (details: OrderDetailsModel) => {
        order.details = details;
        order.isLoadingDetails = false;
        this.selectedViewReview = {
          stars: details.stars ?? 0,
          text: details.reviewNote ?? '',
          image: details.reviewImg ? `${environment.reviewImageBaseUrl}${details.reviewImg}` : ''
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
    this.selectedOrder = { ...order, orderID: order.orderID ?? order.orderId };
    if (order.reviewId && order.reviewId > 0) {
      this.newReview = {
        stars: order.details?.stars || 5,
        text: order.details?.reviewNote || '',
        image: null
      };
    } else {
      this.newReview = { stars: 5, text: '', image: null };
    }
    this.displayReviewDialog = true;
  }

  downloadInstructions() {
    const a = document.createElement('a');
    a.href = 'assets/images/instruction.png';
    a.download = 'instruction.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

 
   private triggerDownloadPDF(promptText: string, siteName: string) {
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    const pageHeight = doc.internal.pageSize.getHeight();
    const margin = 20; // שוליים
    const maxLineWidth = pageWidth - (margin * 2);

    const logoImg = new Image();
    logoImg.src = 'assets/images/logo.png'; 

    logoImg.onload = () => {
        
        // פונקציה להוספת הרקע והסימן מים - נקרא לה בכל עמוד חדש
        const applyPageTemplate = () => {
            // רקע סגול כהה (בהתאם לעיצוב של Busy-4u)
            doc.setFillColor(45, 10, 80);
            doc.rect(0, 0, pageWidth, pageHeight, 'F');

            // הוספת הלוגו כסימן מים בשקיפות נמוכה
            const imgSize = 100;
            doc.saveGraphicsState();
            doc.setGState(new (doc as any).GState({ opacity: 0.07 }));
            doc.addImage(logoImg, 'PNG', (pageWidth - imgSize) / 2, (pageHeight - imgSize) / 2, imgSize, imgSize);
            doc.restoreGraphicsState();
        };

        // --- עמוד 1: עמוד שער ---
        applyPageTemplate();
        doc.setTextColor(255, 255, 255);
        doc.setFontSize(40);
        doc.setFont("helvetica", "bold");
        doc.text(siteName, pageWidth / 2, 80, { align: "center" });
        doc.setFontSize(20);
        doc.text("Website Design Prompt", pageWidth / 2, 100, { align: "center" });

        // --- עמוד 2 והלאה: תוכן הפרומפט ---
        doc.addPage();
        applyPageTemplate();

        doc.setFontSize(18);
        doc.text("System Instructions", margin, 30);
        
        doc.setFontSize(12);
        doc.setFont("helvetica", "normal");

        // פיצול הטקסט לשורות שמתאימות לרוחב הדף
        const splitLines = doc.splitTextToSize(promptText, maxLineWidth);
        
        let cursorY = 50; // מיקום התחלה אנכי
        const lineHeight = 7; // רווח בין שורות

        splitLines.forEach((line: string) => {
            // בדיקה האם השורה הבאה תחרוג מהעמוד (משאירים מרווח ביטחון של 20 מהקצה)
            if (cursorY > pageHeight - 20) {
                doc.addPage();
                applyPageTemplate();
                doc.setTextColor(255, 255, 255); // החזרת צבע לבן לאחר פתיחת עמוד
                cursorY = 30; // איפוס מיקום אנכי בעמוד החדש
            }
            doc.text(line, margin, cursorY);
            cursorY += lineHeight;
        });

        doc.save(`${siteName}_Full_Prompt.pdf`);
    };

    logoImg.onerror = () => {
        console.error("Logo failed to load");
        doc.save(`${siteName}_Prompt.pdf`);
    };
}




   private async sendEmail(promptText: string, siteName: string) {
  try {
    // אלו המשתנים שיכנסו לתוך ה-{{ }} שהגדרת בתבנית
    const templateParams = {
      to_email: this.user!.userName,      // מתאים ל-{{to_email}} בשדה הנמען
      name: siteName,                    // מתאים ל-{{name}} שהגדרת בגוף המייל
      message: promptText,               // מתאים ל-{{message}} שהגדרת בתוכן ובנושא
      from_email: this.user!.userName,   // מייל המשתמש
 // טלפון המשתמש (אם תרצי להוסיף לתבנית)
    };

    await emailjs.send(
      'service_jwf0j1g',      // ה-Service ID מהתמונה הראשונה שלך
      'template_dw51v6n',     // ה-Template ID (שימי לב: ודאי שזה ה-ID של התבנית החדשה ששמרת)
      templateParams,
      'aW3nRdKhDr4xwyblv'     // ה-Public Key שלך
    );

    this.messageService.add({ 
      severity: 'success', 
      summary: 'Email Sent', 
      detail: 'The prompt has been sent to your email.', 
      life: 3000 
    });
  } catch (error) {
    console.error('EmailJS Error:', error);
    this.messageService.add({ 
      severity: 'warn', 
      summary: 'Email Failed', 
      detail: 'Prompt downloaded but the email could not be sent.', 
      life: 3000 
    });
  }
  }

  downloadPrompt(order: any) {
    const siteName = order.details?.siteName || order.siteName || 'prompt';
    order.isDownloading = true;

    this.orderService.generatePrompt(order.orderID).subscribe({
      next: (promptText: string) => {
        order.isDownloading = false;
        if (promptText) {
          if (order.details) order.details.prompt = promptText;
          this.triggerDownloadPDF(promptText, siteName);
          this.sendEmail(promptText, siteName);
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

  saveReview() {
    if (!this.selectedOrder || !this.user) return;
    const reviewData: AddReviewModel = {
      orderId: this.selectedOrder.orderID,
      score: this.newReview.stars,
      Note: this.newReview.text,
      ReviewImg: this.newReview.image ?? undefined
    };
    this.reviewServise.saveOrderReview(
      this.selectedOrder.orderID,
      reviewData,
      () => this.orderService.getUserOrders(this.user.userID)
    );
  }
}
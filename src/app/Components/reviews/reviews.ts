import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { ReviewServise } from '../../Servises/ReviewServise/review-servise';
import { ReviewModel } from '../../Models/ReviewModel';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule, RatingModule, CardModule, ToastModule],
  providers: [MessageService],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews implements OnInit {
  reviews: ReviewModel[] = [];
  loaded = false;
  averageScore = 0;

  private reviewService = inject(ReviewServise);
  private messageService = inject(MessageService);
  IMG_URL=environment.reviewImageBaseUrl;
  currentPage:number=0;
  limit:number=20;
  haveNext:boolean=false

  ngOnInit() {
    this.reviewService.getReviews();

    this.reviewService.review$.subscribe({
      next: (data) => {
        if (data) {
          this.reviews = data;
          this.averageScore = data.length
            ? Math.round((data.reduce((sum, r) => sum + r.stars, 0) / data.length) * 10) / 10
            : 0;
        }
        this.loaded = true;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reviews', life: 3000 });
        this.loaded = true;
      }
    });

    this.reviewService.error$.subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reviews', life: 3000 });
          this.loaded = true;
        }
      }
    });
  }
}

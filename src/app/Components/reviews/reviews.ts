import { Component, inject, OnInit, OnDestroy, AfterViewInit, DestroyRef, ViewChild, ElementRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule } from '@angular/common';
import { RatingModule } from 'primeng/rating';
import { FormsModule } from '@angular/forms';
import { CardModule } from 'primeng/card';
import { ToastModule } from 'primeng/toast';
import { ProgressSpinnerModule } from 'primeng/progressspinner';
import { MessageService } from 'primeng/api';
import { ReviewServise } from '../../Servises/ReviewServise/review-servise';
import { ReviewModel } from '../../Models/ReviewModel';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'app-reviews',
  imports: [CommonModule, FormsModule, RatingModule, CardModule, ToastModule, ProgressSpinnerModule],
  providers: [MessageService],
  templateUrl: './reviews.html',
  styleUrl: './reviews.scss',
})
export class Reviews implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('sentinel') private sentinelRef!: ElementRef;

  reviews: ReviewModel[] = [];
  loaded = false;
  isLoadingMore = false;
  allLoaded = false;
  averageScore = 0;

  private reviewService = inject(ReviewServise);
  private messageService = inject(MessageService);
  private destroyRef = inject(DestroyRef);
  private observer!: IntersectionObserver;

  IMG_URL = environment.reviewImageBaseUrl;
  currentPage = 1;
  limit = 20;

  ngOnInit() {
    this.reviewService.getReviews(this.currentPage, this.limit);

    this.reviewService.review$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data) {
          if (this.currentPage === 1) {
            this.reviews = data;
          } else {
            this.reviews = [...this.reviews, ...data];
          }
          if (data.length < this.limit) {
            this.allLoaded = true;
          }
          this.averageScore = this.reviews.length
            ? Math.round((this.reviews.reduce((sum, r) => sum + r.stars, 0) / this.reviews.length) * 10) / 10
            : 0;
        }
        this.loaded = true;
        this.isLoadingMore = false;
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reviews', life: 3000 });
        this.loaded = true;
        this.isLoadingMore = false;
      }
    });

    this.reviewService.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (err) => {
        if (err) {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load reviews', life: 3000 });
          this.loaded = true;
          this.isLoadingMore = false;
        }
      }
    });
  }

  ngAfterViewInit() {
    this.observer = new IntersectionObserver((entries) => {
      if (entries[0].isIntersecting && this.loaded && !this.isLoadingMore && !this.allLoaded) {
        this.loadMore();
      }
    }, { threshold: 0.1 });

    if (this.sentinelRef) {
      this.observer.observe(this.sentinelRef.nativeElement);
    }
  }

  ngOnDestroy() {
    this.observer?.disconnect();
  }

  private loadMore() {
    this.isLoadingMore = true;
    this.currentPage++;
    this.reviewService.getReviews(this.currentPage, this.limit);
  }
}

import { Component, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { SelectModule } from 'primeng/select';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { GeminiServise } from '../../Servises/geminiServise/gemini-servise';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { PlatformServise } from '../../Servises/PlatformServise/platform-servise';
import { ProductServise } from '../../Servises/ProductServise/product-servise';
import { geminiPromptModel } from '../../Models/geminiPromptModel';
import { PlatformsModel } from '../../Models/PlatformsModel';
import { UserModel } from '../../Models/UserModel';
import { Router } from '@angular/router';

type Step = 'input' | 'generating' | 'generated' | 'adding' | 'updating';

@Component({
  selector: 'app-empty-category',
  imports: [CommonModule, FormsModule, ButtonModule, SelectModule, FloatLabelModule, TextareaModule, ToastModule],
  providers: [MessageService],
  templateUrl: './empty-category.html',
  styleUrl: './empty-category.scss',
})
export class EmptyCategory implements OnInit, OnDestroy {
  private geminiServise = inject(GeminiServise);
  private cartServise = inject(CartServise);
  private userServise = inject(UserServise);
  private platformServise = inject(PlatformServise);
  private productServise = inject(ProductServise);
  private messageService = inject(MessageService);
  private router = inject(Router);

  step: Step = 'input';
  userInput = '';
  prompt: geminiPromptModel | null = null;
  editablePromptText = '';
  platforms: PlatformsModel[] = [];
  selectedPlatform: PlatformsModel | null = null;
  user: UserModel | null = null;
  emptyProductId = 0;
  addedToCart = false;
  private catId = 0;

  @Input() set categoryId(value: number) {
    this.catId = value;
    this.loadEmptyProductId();
  }

  ngOnInit() {
    this.userServise.user$.subscribe({
      next: (u) => (this.user = u),
      error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user. Try again.', life: 3000 }); }
    });
    this.platformServise.getPlatforms();
    this.platformServise.platforms$.subscribe({
      next: (p) => { if (p) this.platforms = p; },
      error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load platforms. Try again.', life: 3000 }); }
    });
  }

  loadEmptyProductId(page = 1) {
    if (!this.catId) return;
    this.productServise.getProduct(this.catId, page, 50).subscribe({
      next: (resp) => {
        const products = resp.body?.data ?? [];
        const emptyOne = products.find(p => ((p as any).productsName ?? p.ProductsName)?.trim() === 'Empty');
        if (emptyOne) {
          this.emptyProductId = (emptyOne as any)?.productsID ?? emptyOne?.ProductsID ?? 0;
        } else if (products.length === 50) {
          // full page returned — empty product might be on the next page
          this.loadEmptyProductId(page + 1);
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load empty product. Try again.', life: 3000 });
        }
      },
      error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load empty product. Try again.', life: 3000 }); }
    });
  }

  generate() {
    if (!this.user) { this.goToLogin(); return; }
    if (!this.userInput.trim()) return;
    this.step = 'generating';
    if (!this.prompt) {
      this.geminiServise.AddCategoryPrompt(this.userInput, this.catId).subscribe({
        next: (resp) => {
          this.prompt = resp.body;
          this.editablePromptText = this.prompt?.prompt ?? '';
          this.userInput = '';
          this.step = 'generated';
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to generate. Try again.', life: 3000 });
          this.step = 'input';
        }
      });
    } else {
      this.geminiServise.updateCategoryPrompt(this.prompt.promptId, this.userInput).subscribe({
        next: (resp) => {
          this.prompt = resp.body;
          this.editablePromptText = this.prompt?.prompt ?? '';
          this.userInput = '';
          this.step = 'generated';
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to regenerate. Try again.', life: 3000 });
          this.step = 'generated';
        }
      });
    }
  }

  updatePrompt() {
    if (!this.prompt || !this.editablePromptText.trim()) return;
    this.step = 'updating';
    this.geminiServise.updateCategoryPrompt(this.prompt.promptId, this.editablePromptText).subscribe({
      next: (resp) => {
        this.prompt = resp.body;
        this.editablePromptText = this.prompt?.prompt ?? '';
        this.messageService.add({ severity: 'success', summary: 'Updated', detail: 'Prompt updated successfully.', life: 3000 });
        this.step = 'generated';
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to update prompt. Try again.', life: 3000 });
        this.step = 'generated';
      }
    });
  }

  addToCart() {
    if (!this.user || !this.prompt || !this.selectedPlatform || !this.emptyProductId) return;
    this.step = 'adding';
    this.cartServise.addCartItem({
      userID: this.user.userID,
      productsID: this.emptyProductId,
      userDescription: this.prompt.promptId,
      platformsID: this.selectedPlatform.platformID
    }, this.user.userID).subscribe({
      next: () => {
        this.addedToCart = true;
        this.messageService.add({ severity: 'success', summary: 'Added to Cart', detail: 'Your custom design has been added to the cart!', life: 3000 });
        this.step = 'generated';
      },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to add to cart. Try again.', life: 3000 });
        this.step = 'generated';
      }
    });
  }

  deleteAndReset() {
    if (this.prompt) {
      this.geminiServise.deletePrompt(this.prompt.promptId).subscribe({
        next: () => {},
        error: () => { this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete prompt. Try again.', life: 3000 }); }
      });
    }
    this.prompt = null;
    this.editablePromptText = '';
    this.userInput = '';
    this.selectedPlatform = null;
    this.addedToCart = false;
    this.step = 'input';
  }

  goToLogin() {
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    if (this.prompt && !this.addedToCart) {
      this.geminiServise.deletePrompt(this.prompt.promptId).subscribe({
        next: () => {},
        error: (err) => { console.log(err); }
      });
    }
  }
}


import { Component, EventEmitter, inject, Input, OnInit, OnDestroy, Output, DestroyRef } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { GeminiServise } from '../../Servises/geminiServise/gemini-servise';
import { geminiPromptModel } from '../../Models/geminiPromptModel';
import { MessageService } from 'primeng/api';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { UserModel } from '../../Models/UserModel';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { Router } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
  selector: 'app-empty-product',
  imports: [FormsModule, FloatLabel, InputText, CurrencyPipe],
  providers: [MessageService],
  templateUrl: './empty-product.html',
  styleUrl: './empty-product.scss',
})
export class EmptyProduct implements OnInit, OnDestroy {
  constructor(private messageService: MessageService) {}

  @Output() geminiPrompt = new EventEmitter<geminiPromptModel | null>();
  @Input() price: number = 0;
  @Input() set promptConsumed(v: boolean) {
    if (v) this.promptWasUsedInCart = true;
  }

  @Input() set reset(v: number) {
    if (v > 0) this.resetToInit();
  }

  private promptWasUsedInCart = false;
  prompt?: geminiPromptModel | null;
  editablePrompt: string = '';       // bound to the inline-editable textarea
  flag: boolean = false;             // true once generate is clicked
  isUpdating: boolean = false;       // spinner for update call
  input?: string;                    // initial description input
  productTitle: string = '';         // optional design title
  ctategoryId!: number;
  user!: UserModel | null;

  userServise = inject(UserServise);
  geminiServise = inject(GeminiServise);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);

  @Input() set id(value: number) {
    this.ctategoryId = value;
  }

  ngOnInit(): void {
    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => { this.user = data; },
      error: () => {
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });
      }
    });
  }

  ngOnDestroy(): void {
    if (this.prompt && !this.promptWasUsedInCart) {
      this.geminiServise.deletePrompt(this.prompt.promptId).subscribe({
        error:(err)=>{
        console.log(err)
      }});
    }
  }

  /** Called when user clicks "Generate Design" */
  generate() {
    if (!this.user) { this.router.navigate(['/login']); return; }
    if (!this.input?.trim()) return;

    const combined = this.productTitle ? `${this.productTitle}: ${this.input}` : this.input;
    this.flag = true;

    this.geminiServise.addNewProduct(this.ctategoryId, combined!).subscribe({
      next: (data) => {
        if (data?.body) {
          this.prompt = data.body;
          this.editablePrompt = data.body.prompt;
          this.geminiPrompt.emit(this.prompt);
        } else {
          this.flag = false;
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong, try again', life: 3000 });
        }
      },
      error: () => {
        this.flag = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong, try again', life: 3000 });
      }
    });
  }

  /** Called when user clicks "Update" — resubmits the (possibly edited) prompt text */
  update() {
    if (!this.editablePrompt?.trim() || !this.prompt) return;
    this.isUpdating = true;

    this.geminiServise.updateProductPrompt(this.prompt.promptId, this.editablePrompt).subscribe({
      next: (data) => {
        this.isUpdating = false;
        if (data?.body) {
          this.prompt!.prompt = data.body.prompt;
          this.editablePrompt = data.body.prompt;
          this.geminiPrompt.emit(this.prompt); // keep parent in sync
        } else {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong, try again', life: 3000 });
        }
      },
      error: () => {
        this.isUpdating = false;
        this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Something went wrong, try again', life: 3000 });
      }
    });
  }

  /** Reset UI to initial state without deleting from server (prompt already consumed) */
  resetToInit() {
    this.prompt = null;
    this.editablePrompt = '';
    this.input = '';
    this.productTitle = '';
    this.flag = false;
    this.isUpdating = false;
    this.promptWasUsedInCart = true; // prevent ngOnDestroy from deleting
  }

  /** Delete prompt and reset to initial state */
  deletePrompt() {
    if (this.prompt) {
      this.geminiServise.deletePrompt(this.prompt.promptId).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: () => {
          this.prompt = null;
          this.editablePrompt = '';
          this.input = '';
          this.productTitle = '';
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to delete prompt', life: 3000 });
        }
      });
    } else {
      this.prompt = null;
      this.editablePrompt = '';
      this.input = '';
      this.productTitle = '';
    }
    this.flag = false;
    this.isUpdating = false;
    this.geminiPrompt.emit(null);
  }
}


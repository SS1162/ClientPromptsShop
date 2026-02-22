import { Component, EventEmitter, inject, Input, OnInit, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiServise } from '../../Servises/geminiServise/gemini-servise';
import { geminiPromptModel } from '../../Models/geminiPromptModel';
import { MessageService } from 'primeng/api';
import { FloatLabel } from 'primeng/floatlabel';
import { InputText } from 'primeng/inputtext';
import { UserModel } from '../../Models/UserModel';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { Router } from '@angular/router';

@Component({
  selector: 'app-empty-product',
  imports: [FormsModule, FloatLabel, InputText],
  providers: [MessageService],
  templateUrl: './empty-product.html',
  styleUrl: './empty-product.scss',
})
export class EmptyProduct implements OnInit {
  constructor(private messageService: MessageService) { }
  @Output() geminiPrompt = new EventEmitter<geminiPromptModel | null>
  prompt?: geminiPromptModel | null
  flag: boolean = false
  input?: string
  productTitle: string = ''
  ctategoryId!: number
  user!: UserModel | null
  userServise: UserServise = inject(UserServise)
  geminiServise: GeminiServise = inject(GeminiServise)
  private router = inject(Router)
  @Input() set id(value: number) {
    this.ctategoryId = value
  }
   ngOnInit(): void {
      this.userServise.user$.subscribe({
        next: (data) => {
          this.user = data
        },
        error: () => {
          this.messageService.add({ severity: 'error', summary: 'Error', detail: 'Failed to load user' });
        }
      })
    }
  sentGemini() {
if(!this.user)
{
    this.router.navigate(['/login']);
      return;
}
   
    const combined = this.productTitle ? `${this.productTitle}: ${this.input}` : this.input;
    if (this.input !== undefined) {
      this.flag = true
      if (this.prompt === undefined) {
        this.geminiServise.addNewProduct(this.ctategoryId, combined!).subscribe({
          next: (data) => {
            if (data !== null && data !== undefined) {
              this.input = ""
              this.prompt = data.body

            }
            else {
              this.messageService.add({ severity: 'error', summary: 'error accuard!', detail: 'error accuard try again', life: 3000 });

            }

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'error accuard!', detail: 'error accuard try again', life: 3000 });
          }
        }
        )
      }
      else {
        this.geminiServise.updateProductPrompt(this.prompt!.PromptId, this.input).subscribe({
          next: (data) => {
            if (data.body!.Prompt !== this.prompt!.Prompt) {
              this.input = ""
              this.prompt!.Prompt = data.body!.Prompt

            }
            else {
              this.messageService.add({ severity: 'error', summary: 'error accuard!', detail: 'error accuard try again', life: 3000 });
            }

          },
          error: (err) => {
            this.messageService.add({ severity: 'error', summary: 'error accuard!', detail: 'error accuard try again', life: 3000 });
          }
        }
        )
      }
    }

  }

  sentFather() {
    this.geminiPrompt.emit(this.prompt)
  }

  Cancel() {
    this.input = ""
    this.geminiPrompt.emit(null)
    this.geminiServise.deletePrompt(this.prompt!.PromptId)
    this.prompt = null
    this.flag = false
  }
}

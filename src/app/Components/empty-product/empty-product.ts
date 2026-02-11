import { Component, EventEmitter, inject, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { GeminiServise } from '../../Servises/geminiServise/gemini-servise';
import { geminiPromptModel } from '../../Models/geminiPromptModel';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-empty-product',
  imports: [FormsModule],
  providers: [MessageService],
  templateUrl: './empty-product.html',
  styleUrl: './empty-product.scss',
})
export class EmptyProduct {
  constructor(private messageService: MessageService) { }
  @Output() geminiPrompt = new EventEmitter<geminiPromptModel | null>
  prompt?: geminiPromptModel | null
  flag: boolean = false
  input?: string
  ctategoryId!: number
  geminiServise: GeminiServise = inject(GeminiServise)
  @Input() set id(value: number) {
    this.ctategoryId = value
  }
  sentGemini() {

    if (this.input !== undefined) {
      this.flag=true
      if (this.prompt === undefined) {
        this.geminiServise.addNewProduct(this.ctategoryId, this.input).subscribe({
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
        this.geminiServise.updateProductPrompt(this.prompt!.promptId, this.input).subscribe({
          next: (data) => {
            if (data.body!.prompt !== this.prompt!.prompt) {
              this.input = ""
              this.prompt!.prompt = data.body!.prompt
              
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

  Cancel(){
    this.input=""
    this.geminiPrompt.emit(null)
    this.geminiServise.deletePrompt(this.prompt!.promptId)
    this.prompt=null
    this.flag=false
  }
}

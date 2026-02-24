import { Component, inject, ElementRef, ViewChild, AfterViewChecked, OnInit, DestroyRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ChatServise, ChatMessageDto } from '../../Servises/chatServise/chat-servise';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-chat-bot',
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-bot.html',
  styleUrl: './chat-bot.scss',
})
export class ChatBot implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer!: ElementRef;

  isOpen = false;
  cartOpen = false;
  messages: ChatMessageDto[] = [];
  newMessage = '';
  isLoading = false;
  private shouldScroll = false;

  private chatServise = inject(ChatServise);
  private cartServise = inject(CartServise);
  private destroyRef = inject(DestroyRef);

  ngOnInit() {
    const saved = this.chatServise.loadSession();
    if (saved.length > 0) {
      this.messages = saved;
    }
    this.cartServise.popupOpen$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(open => {
      this.cartOpen = open;
    });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
    if (this.isOpen && this.messages.length === 0) {
      const greeting: ChatMessageDto = {
        role: 'model',
        text: "Hi! I'm your PromptStore assistant 👋 How can I help you today?"
      };
      this.messages.push(greeting);
      this.chatServise.saveSession(this.messages);
    }
  }

  sendMessage() {
    const text = this.newMessage.trim();
    if (!text || this.isLoading) return;

    this.messages.push({ role: 'user', text });
    this.newMessage = '';
    this.isLoading = true;
    this.shouldScroll = true;

    // Send the full history EXCLUDING the last user message as history,
    // then the last message as newMessage — matching the server's ChatRequestDto
    const history = this.messages.slice(0, -1);

    this.chatServise.sendMessage(history, text).subscribe({
      next: (response) => {
        this.messages.push({ role: 'model', text: response });
        this.chatServise.saveSession(this.messages);
        this.isLoading = false;
        this.shouldScroll = true;
      },
      error: () => {
        this.messages.push({ role: 'model', text: 'Sorry, something went wrong. Please try again.' });
        this.chatServise.saveSession(this.messages);
        this.isLoading = false;
        this.shouldScroll = true;
      }
    });
  }

  onKeyDown(event: KeyboardEvent) {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  ngAfterViewChecked() {
    try {
      if (this.shouldScroll && this.messagesContainer) {
        const el = this.messagesContainer.nativeElement;
        el.scrollTop = el.scrollHeight;
        this.shouldScroll = false;
      }
    } catch {}
  }
}

import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface ChatMessageDto {
  role: 'user' | 'model';
  text: string;
}

const SESSION_KEY = 'chat_session';

@Injectable({
  providedIn: 'root',
})
export class ChatServise {
  private http: HttpClient = inject(HttpClient);
  private BASIC_URL: string = `${environment.apiUrl}/Chat`;

  sendMessage(history: ChatMessageDto[], newMessage: string): Observable<string> {
    return this.http.post<string>(
      this.BASIC_URL,
      { history, newMessage },
      { responseType: 'text' as 'json' }
    );
  }

  loadSession(): ChatMessageDto[] {
    try {
      const raw = sessionStorage.getItem(SESSION_KEY);
      return raw ? (JSON.parse(raw) as ChatMessageDto[]) : [];
    } catch {
      return [];
    }
  }

  saveSession(messages: ChatMessageDto[]): void {
    try {
      sessionStorage.setItem(SESSION_KEY, JSON.stringify(messages));
    } catch {}
  }

  clearSession(): void {
    sessionStorage.removeItem(SESSION_KEY);
  }
}

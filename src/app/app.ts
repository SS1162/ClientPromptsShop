import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Menu } from './Components/menu/menu';
import { ButtomNevigation } from './Components/buttom-nevigation/buttom-nevigation';
import { ChatBot } from './Components/chat-bot/chat-bot';
import { PopCart } from './Components/pop-cart/pop-cart';
import { AccessibilitySidebar } from './Components/accessibility-sidebar/accessibility-sidebar';
import { AccessibilityService } from './Servises/accessibilityServise/accessibility-servise';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu, ButtomNevigation, ChatBot, PopCart, AccessibilitySidebar],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
  private a11y = inject(AccessibilityService);
  private router = inject(Router);

  showCustomerUI = signal(true);

  constructor() {

    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {

      this.showCustomerUI.set(!this.router.url.startsWith('/admin'));
    });
  }
}
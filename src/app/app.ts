import { Component, inject, signal } from '@angular/core';
import { RouterOutlet, Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Menu } from './Components/menu/menu';
import { BottomNavigation } from './Components/bottom-navigation/bottom-navigation';
import { ChatBot } from './Components/chat-bot/chat-bot';
import { PopCart } from './Components/pop-cart/pop-cart';
import { AccessibilitySidebar } from './Components/accessibility-sidebar/accessibility-sidebar';
import { AccessibilityService } from './Services/accessibility/accessibility.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Menu, BottomNavigation, ChatBot, PopCart, AccessibilitySidebar],
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
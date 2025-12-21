import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './Components/register/register';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Register],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
}

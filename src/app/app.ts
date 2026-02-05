import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Register } from './Components/register/register';
import { Login } from './Components/login/login';
import { MainCategory } from './Components/main-category/main-category';
import { Category } from './Components/category/category';
import { UpdateUser } from './Components/update-user/update-user';
import { Menu } from './Components/menu/menu';
import { ButtomNevigation } from './Components/buttom-nevigation/buttom-nevigation';


@Component({
  selector: 'app-root',
  imports: [RouterOutlet,Menu,ButtomNevigation],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App {
  protected readonly title = signal('client');
}

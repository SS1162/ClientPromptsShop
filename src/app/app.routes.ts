import { Routes } from '@angular/router';
import { Menu } from 'primeng/menu';
import { Register } from './Components/register/register';
import { Login } from './Components/login/login';
import { UpdateUser } from './Components/update-user/update-user';
import { MainCategory } from './Components/main-category/main-category';
import { Category } from './Components/category/category';


export const routes: Routes = [

  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'update', component: UpdateUser },
  { path: '', redirectTo: 'login', pathMatch: 'full' },//change to home later
  { path: 'mainCategory/:id', component: MainCategory },
   { path: 'category/:id', component: Category }
];

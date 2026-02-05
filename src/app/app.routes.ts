import { Routes } from '@angular/router';
import { Menu } from 'primeng/menu';
import { Register } from './Components/register/register';
import { Login } from './Components/login/login';
import { UpdateUser } from './Components/update-user/update-user';
import { MainCategory } from './Components/main-category/main-category';
import { Category } from './Components/category/category';
import { PlatformGuides } from './Components/platform-guides/platform-guides';
import { ContactUs } from './Components/contact-us/contact-us';
import { Orders } from './Components/orders/orders';
import { FullScreenCart } from './Components/full-screen-cart/full-screen-cart';
import { PrivacyPolicy } from './Components/privacy-policy/privacy-policy';
import { Accessibility } from './Components/accessibility/accessibility';
import { RefundPolicy } from './Components/refund-policy/refund-policy';
import { TermsofService } from './Components/termsof-service/termsof-service';


export const routes: Routes = [

  { path: 'register', component: Register },
  { path: 'login', component: Login },
  { path: 'update', component: UpdateUser },
  { path: '', redirectTo: 'login', pathMatch: 'full' },//change to home later
  { path: 'mainCategory/:id', component: MainCategory },
  { path: 'category/:id', component: Category },
  { path: 'platformGuides', component: PlatformGuides },
  { path: 'contactUs', component: ContactUs },
  { path: 'orders', component: Orders },
  { path: 'fullScreenCart', component: FullScreenCart },
  { path: 'privacyPolicy', component: PrivacyPolicy },
  { path: 'accessibility', component: Accessibility },
  { path: 'refundPolicy', component: RefundPolicy },
  { path: 'termsofService', component: TermsofService }

];

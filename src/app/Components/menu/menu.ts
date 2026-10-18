import { Component, DestroyRef, inject } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MainCategoriesModel } from '../../Models/MainCategoriesModel';
import { MainCategoryService } from '../../Services/main-category/main-category.service';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { UserService } from '../../Services/user/user.service';
import { CartService } from '../../Services/cart/cart.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink ,RouterModule} from '@angular/router';
import { routes } from '../../app.routes';
import { SelectModule } from 'primeng/select';
import { FormsModule } from '@angular/forms';
import { CurrencyService, CurrencyOption } from '../../Services/currency/currency.service';

@Component({
  selector: 'app-menu',
  imports: [MegaMenu, ButtonModule, CommonModule, AvatarModule, MegaMenuModule, MenuModule, RouterLink, RouterModule, SelectModule, FormsModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  items: MegaMenuItem[] = [
    { label: 'Home', root: true },
    { label: 'Basic Site', root: true},
    { label: 'Products', root: true, items: [[{ items: [] }]] },
    { label: 'Review', root: true },
    { label: 'Contact', root: true }
  ]
  private router = inject(Router);
  private DestroyRef = inject(DestroyRef);
  private mainCategoryService = inject(MainCategoryService);
  private cartService = inject(CartService);
  currencyService = inject(CurrencyService);
  mainCategories: MainCategoriesModel[] | null = [];
  userService = inject(UserService);
  cartCount = 0;
  currencies: CurrencyOption[] = [];
  selectedCurrency: CurrencyOption = { code: 'USD', name: 'United States Dollar' };
  itemsForProfile: MenuItem[] | undefined;
  ngOnInit() {
     this.currencyService.loadCurrencies();
    this.currencyService.currencies$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data => {
      this.currencies = data;
    });
    this.currencyService.selectedCurrency$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(c => {
      this.selectedCurrency = c;
    });
    this.itemsForProfile = [
      {
        label: 'Options',
        items: [
          {
            label: 'login',
            icon: 'pi pi-sign-in',
            routerLink:['/login']
            
          },
           {
            label: 'update ditels',
            icon: 'pi pi-pencil', 
            routerLink:['/update']
          },
          {
            label: 'register',
            icon: 'pi pi-user',
            routerLink:['/register']
          },
           {
            label: 'log out',
            icon: 'pi pi-sign-out',
            command: () => this.logOut()
          },
           {
            label: 'cart',
            icon: 'pi pi-shopping-cart',
            routerLink:['/fullScreenCart']
          },
           {
            label: 'orders',
            icon: 'pi pi-briefcase',
            routerLink:['/orders']
          },

        ]
      }
    ];
    this.cartService.cartItems$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(items => {
      this.cartCount = items ? items.length : 0;
    });

    this.userService.user$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(user => {
      if (user) this.cartService.getUserCart(user.userID);
    });

    this.mainCategoryService.getMainCategory();
    this.mainCategoryService.mainCategories$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data => {
      if(data!==null)
      {
         this.mainCategories=data
         this.items=[
    { label: 'Home', root: true ,command: () => { this.router.navigate(['/home'])} },
    { label: 'Basic Site', root: true ,command: () => { this.router.navigate(['/basicSite'])} },
    { label: 'Products', root: true, items: [[{ items: [] }]] },
    { label: 'Review', root: true ,command: () => { this.router.navigate(['/reviews'])}},
    { label: 'Contact', root: true ,command: () => { this.router.navigate(['/contactUs'])}}
  ]
         for (let i = 0; i < (this.mainCategories?.length ?? 0); i++) {
          this.items[2].items![0][0].items!.push({ label: this.mainCategories![i].mainCategoryName, icon: 'pi pi-star', id: this.mainCategories![i].mainCategoryID as unknown as string })
        }
        console.log(this.items)

        this.items = [...this.items]
      }

     
    })

this.mainCategoryService.error$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>{
  if(data!==null)
  {
    console.log(data)
  }

})

   
  }
  onCurrencyChange(currency: CurrencyOption): void {
    this.currencyService.selectCurrency(currency);
  }

  logOut() {
    this.userService.LogOut();

  }
}

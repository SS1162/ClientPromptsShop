import { Component, DestroyRef, inject } from '@angular/core';
import { MegaMenuModule } from 'primeng/megamenu';
import { OnInit } from '@angular/core';
import { MegaMenuItem } from 'primeng/api';
import { MegaMenu } from 'primeng/megamenu';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { MainCategoriesModel } from '../../Models/MainCategoriesModel';
import { MainCategoryServise } from '../../Servises/MainCategoriesServise/main-category';
import { MenuItem } from 'primeng/api';
import { MenuModule } from 'primeng/menu';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router, RouterLink ,RouterModule} from '@angular/router';
import { routes } from '../../app.routes';

@Component({
  selector: 'app-menu',
  imports: [MegaMenu, ButtonModule, CommonModule, AvatarModule, MegaMenuModule, MenuModule, RouterLink, RouterModule],
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
  private mainCategoryServise = inject(MainCategoryServise);
  private cartServise = inject(CartServise);
  mainCategories: MainCategoriesModel[] | null = [];
  userServise = inject(UserServise);
  cartCount = 0;
  itemsForProfile: MenuItem[] | undefined;
  ngOnInit() {
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
            command: () => { this.logOut()}
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
    this.cartServise.cartItems$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(items => {
      this.cartCount = items ? items.length : 0;
    });

    this.userServise.user$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(user => {
      if (user) this.cartServise.getUserCart(user.userID);
    });

    this.mainCategoryServise.getMainCategory();
    this.mainCategoryServise.mainCategories$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data => {
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

this.mainCategoryServise.error$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>{
  if(data!==null)
  {
    console.log(data)
  }

})

   
  }
  logOut(){
  this.userServise.LogOut()
}
}

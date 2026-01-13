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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-menu',
  imports: [MegaMenu, ButtonModule, CommonModule, AvatarModule, MegaMenuModule, MenuModule],
  templateUrl: './menu.html',
  styleUrl: './menu.scss',
})
export class Menu implements OnInit {
  items: MegaMenuItem[] = [
    { label: 'Home', root: true },
    { label: 'BasicSite', root: true },
    { label: 'Products', root: true, items: [[{ items: [] }]] },
    { label: 'Review', root: true },
    { label: 'Contact', root: true }
  ]
private DestroyRef=inject(DestroyRef)
  private mainCategoryServise = inject(MainCategoryServise)
  mainCategories: MainCategoriesModel[] | null = []
  userServise = inject(UserServise)
  itemsForProfile: MenuItem[] | undefined;
  ngOnInit() {
    this.mainCategoryServise.getMainCategory()
    this.mainCategoryServise.mainCategories$.pipe(takeUntilDestroyed(this.DestroyRef)).subscribe(data=>{
      if(data!==null)
      {
         this.mainCategories=data
         this.items=[
    { label: 'Home', root: true },
    { label: 'BasicSite', root: true },
    { label: 'Products', root: true, items: [[{ items: [] }]] },
    { label: 'Review', root: true },
    { label: 'Contact', root: true }
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

    this.itemsForProfile = [
      {
        label: 'Options',
        items: [
          {
            label: 'login',
            icon: 'pi pi-sign-in'
          },
           {
            label: 'update ditels',
            icon: 'pi pi-pencil'
          },
          {
            label: 'register',
            icon: 'pi pi-user'
          },
           {
            label: 'log out',
            icon: 'pi pi-sign-out'
          },
           {
            label: 'cart',
            icon: 'pi pi-shopping-cart'
          },
           {
            label: 'orders',
            icon: 'pi pi-briefcase'
          },

        ]
      }
    ];
  }
  logOut(){
  this.userServise.LogOut()
}
}

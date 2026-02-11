import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { RatingModule } from 'primeng/rating';
import { FileUploadModule } from 'primeng/fileupload';
import { FloatLabelModule } from 'primeng/floatlabel';
import { TextareaModule } from 'primeng/textarea';
import { Route, Router, RouterLink } from "@angular/router";
import { UserServise } from '../../Servises/UserServise/User-servise';
import { MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { RippleModule } from 'primeng/ripple';
import { CartServise } from '../../Servises/cartServise/cart-servise';
import { CartItemModel } from '../../Models/CartItemModel';
import { CardModule } from 'primeng/card';
import { UserModel } from '../../Models/UserModel';
import { BasicSiteModel } from '../../Models/BasicSiteModel';
import { BasicSiteService } from '../../Servises/BasicSiteServise/basic-site.service';
@Component({
  selector: 'app-full-screen-cart',
  imports: [
    CommonModule, ButtonModule, DialogModule, RatingModule, TextareaModule, FileUploadModule, FormsModule, FloatLabelModule,
    RouterLink, ToastModule, RippleModule,CardModule
  ],
  providers: [MessageService],
  templateUrl: './full-screen-cart.html',
  styleUrl: './full-screen-cart.scss',
})

export class FullScreenCart implements OnInit {
  cartItems: CartItemModel[] = []
  displayReviewDialog: boolean = false;
  cartServise: CartServise = inject(CartServise)
  userServise: UserServise = inject(UserServise)
  private messageService = inject(MessageService);
  router: Router = inject(Router)
  userID!: number | null
  user!:UserModel
  error: string = ""
  noItems: string = ""
  basicSite?:BasicSiteModel
 basicSiteServise:BasicSiteService=inject(BasicSiteService)
  ngOnInit() {

    this.userServise.user$.subscribe({
      next: (data) => {
        this.error = ""
        if (data !== null) {
          this.userID = data.userID
          this.cartServise.getUserCart( this.userID)
          this.user=data
        }
        else {
          this.router.navigate(['/login'])
        }

      },
      error: () => {
        this.error = "An error occurred while trying to load the product. Please try again later"
        this.showError()
      }
    })

if(this.user.BasicID)
{
     this.basicSiteServise.getBasicSites(this.user.BasicID)
     this.basicSiteServise.basicSites$.subscribe({
      next:(data)=>
      {
        if(data)
        {
           this.basicSite=data  
        }
   
      },
      error:()=>{
         this.error = "An error occurred while trying to load the product. Please try again later"
        this.showError()
      }
     })
}


    this.cartServise.error$.subscribe({
      next: (err) => {
        if (err !== null) {
          this.error = "An error occurred while trying to load the product. Please try again later"
          this.showError()
        }
      },
      error: () => {

        this.error = "An error occurred while trying to load the product. Please try again later"
        this.showError()
      }
    })

    this.cartServise.cartItems$.subscribe({
      next: (data) => {
        
        this.error=""
        if (data === null) {
          this.noItems = "Every great creation begins with a single prompt. Your cart is waiting for the next big idea."
        }
        else{
          this.noItems=""
          this.cartItems=data
        }
      },
      error: () => {
        this.error = "An error occurred while trying to load the product. Please try again later"
        this.showError()
      }
    })

  }

  showError() {
    this.messageService.add({ severity: 'error', summary: 'Error', detail: this.error });
  }

changeProductToValid(cartId:number){
this.cartServise.changeProductToValid(cartId,this.user.userID)
}
changeProductToInValid(cartId:number){
  this.cartServise.changeProductToInValid(cartId,this.user.userID)
}
  
removeProduct(cartId:number){
  this.cartServise.removeCartItem(cartId,this.user.userID)
}

goToPaiment(){}


}
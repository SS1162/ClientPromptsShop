
import { Component, DestroyRef, inject, AfterViewInit, OnInit, NgZone } from '@angular/core';
import { InputTextModule } from 'primeng/inputtext';
import { FormGroup, FormsModule, Validators } from '@angular/forms';
import { FloatLabel } from 'primeng/floatlabel';
import { PasswordModule } from 'primeng/password';
import { IftaLabelModule } from 'primeng/iftalabel';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { CommonModule } from '@angular/common';
import { FormControl } from '@angular/forms';
import { ReactiveFormsModule } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { LoginModel } from '../../Models/LoginModel';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { HttpErrorResponse } from '@angular/common/http';
import { UserModel } from '../../Models/UserModel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { take } from 'rxjs';
import { Router, RouterModule } from '@angular/router';
import { Location } from '@angular/common';
import { RegisterUserModel } from '../../Models/RegisterUserModel';
import { CartServise } from '../../Servises/cartServise/cart-servise';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabel, PasswordModule, IftaLabelModule, CardModule, CommonModule, ReactiveFormsModule,
    TextareaModule, ButtonModule, MessageModule, ToastModule, RouterModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})


export class Login implements OnInit, AfterViewInit {
  userServise: UserServise = inject(UserServise)
  cartServise: CartServise = inject(CartServise)
  destroyRef = inject(DestroyRef)
  router = inject(Router);
  messageService = inject(MessageService);
  location: Location = inject(Location);
  user$?: UserModel | null
  error$?: HttpErrorResponse | null
  public googleClientId = environment.googleClientId;
  loginUser: LoginModel = new LoginModel();
  isproper: boolean = true;
  flag: boolean = false
  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])

  })



  constructor(private ngZone: NgZone) { }

  ngOnInit() {

    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      if (data !== null && this.flag) {
        this.flag = false;
        this.messageService.add({
          severity: 'success',
          summary: 'Welcome Back!',
          detail: 'You have logged in successfully.',
          life: 2000
        });
        const pending = JSON.parse(sessionStorage.getItem('pendingCartItems') || '[]');
        if (pending.length > 0) {
          sessionStorage.removeItem('pendingCartItems');
          for (const item of pending) {
            this.cartServise.addCartItem(
              { userID: data.userID, productsID: item.productsID, platformsID: item.platformsID },
              data.userID
            ).subscribe();
          }
        }
        setTimeout(() => {
          this.userServise.isAdmin$.pipe(take(1)).subscribe(isAdmin => {
            if (isAdmin) {
              this.router.navigate(['/admin']);
            } else if (window.history.length > 1) {
              this.location.back();
            } else {
              this.router.navigate(['/']);
            }
          });
        }, 2000);
      }
    });

    this.userServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.error$ = data
      if (data !== null && data !== undefined) {
        this.messageService.add({
          severity: 'error',
          summary: 'Login Failed',
          detail: 'An error occurred. Please try again later.',
          life: 4000
        });
      }
    });


    (window as any).handleCredentialResponse = (response: any) => {
      this.ngZone.run(() => {
        this.onSignIn(response);
      });
    };
  }

  ngAfterViewInit() {
    this.renderGoogleButton();
  }

 renderGoogleButton() {
  if (typeof google !== 'undefined' && google.accounts) {
google.accounts.id.initialize({
  client_id: this.googleClientId,
  callback: (window as any).handleCredentialResponse,
  ux_mode: 'popup',
  use_fedcm_for_prompt: true // זה משתמש במנגנון החדש של הדפדפן לעקיפת חסימות Cross-Origin
});

    const btnEl = document.getElementById("googleBtn");
    
    // שינוי 3: הגנה מפני רוחב לא תקין (גוגל לא מקבלת אחוזים או ערכים קטנים מדי)
    let btnWidth = btnEl ? btnEl.offsetWidth : 250;
    if (btnWidth < 200 || btnWidth > 400) {
      btnWidth = 250; // ערך בטוח שגוגל תמיד מאשרת
    }

    google.accounts.id.renderButton(
      btnEl,
      { 
        theme: "outline", 
        size: "large", 
        width: btnWidth // כאן נשלח מספר נקי
      }
    );
  } else {
    setTimeout(() => this.renderGoogleButton(), 100);
  }
}

  onSignIn(response: any) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    const user = new RegisterUserModel()
    user.userName = payload.email
    user.firstName=payload.name
    user.GoogleId=payload.sub
    this.userServise.signInWithGoogle(user)
    this.flag=true
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.isproper = true;
      this.loginUser.userName = this.loginForm.value.email || ''
      this.loginUser.userPassward = this.loginForm.value.password || ''
      this.userServise.LoginUser(this.loginUser)
      this.loginForm.reset()
      this.flag = true
    }
  }
}
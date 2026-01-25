// import { Component, DestroyRef, inject } from '@angular/core';
// import { InputTextModule } from 'primeng/inputtext';
// import { FormGroup, FormsModule, Validators } from '@angular/forms';
// import { FloatLabel } from 'primeng/floatlabel';
// import { PasswordModule } from 'primeng/password';
// import { IftaLabelModule } from 'primeng/iftalabel';
// import { CardModule } from 'primeng/card';
// import { ButtonModule } from 'primeng/button';
// import { CommonModule } from '@angular/common';
// import { FormControl } from '@angular/forms';
// import { ReactiveFormsModule } from '@angular/forms';
// import { FormBuilder } from '@angular/forms';
// import { TextareaModule } from 'primeng/textarea';
// import { MessageModule } from 'primeng/message';
// import { ToastModule } from 'primeng/toast';
// import { MessageService } from 'primeng/api';
// import { environment } from '../../../environments/environment';
// import { OnInit, NgZone } from '@angular/core';
// import { LoginModel } from '../../Models/LoginModel';
// import { UserServise } from '../../Servises/UserServise/User-servise';
// import { HttpErrorResponse } from '@angular/common/http';
// import { UserModel } from '../../Models/UserModel';
// import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
// @Component({
//   selector: 'app-login',
//   standalone: true,
//   imports: [FormsModule, InputTextModule, FloatLabel, PasswordModule, IftaLabelModule, CardModule, CommonModule, ReactiveFormsModule,
//     TextareaModule, ButtonModule, MessageModule, ToastModule
//   ],
//   providers: [MessageService],
//   templateUrl: './login.html',
//   styleUrls: ['./login.scss'],
// })


// export class Login implements OnInit{
//      userServise:UserServise=inject(UserServise)
//      private destroyRef=inject(DestroyRef)
//      messageService = inject(MessageService);
//      user$?:UserModel|null
//      error$?:HttpErrorResponse|null
//      errorMessege:string=''
 
//   constructor(private ngZone: NgZone) { }

//   public googleClientId = environment.googleClientId;

//   ngOnInit() {
//     this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data=>{
//    this.user$=data
//    if(data!==null){
//  alert(`Login successful: ${data}`)
//    }
  
// })

// this.userServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data=>{
//   this.error$=data
//   if(data===null)
//   {
//      this.errorMessege=''
//   }
//   else{
//   this.errorMessege=data.error
//   }
 
// })


//     window.addEventListener('google-login-success', (event: any) => {
//       this.ngZone.run(() => {
//         this.onSignIn(event.detail);
//       });
//     });


//     if (!sessionStorage.getItem('pageRefreshed')||sessionStorage.getItem('pageRefreshed') === 'false') {
//       sessionStorage.setItem('pageRefreshed', 'true');
//       setTimeout(() => {


//         location.reload();


//       }, 3000)
//     }

//   }

//   onSignIn(response: any) {

//     const payload = JSON.parse(atob(response.credential.split('.')[1]));
//     console.log('ID: ' + payload.sub);
//     console.log('Full Name: ' + payload.name);
//     console.log('Email: ' + payload.email);
//     console.log('Image URL: ' + payload.picture);
//   }


//   loginForm = new FormGroup({
//     email: new FormControl('', [Validators.required, Validators.email]),
//     password: new FormControl('', [Validators.required])
//   })

//   loginUser: LoginModel = new LoginModel();


//   isproper: boolean = true;
//   onSubmit() {
//     if (this.loginForm.valid) {
//       this.isproper = true;
//       this.loginUser.userName = this.loginForm.value.email || ''
//       this.loginUser.userPassward = this.loginForm.value.password || ''
//       this.userServise.LoginUser(this.loginUser)
//       this.loginForm.reset()
      
//     }
//   }



// ngOnDestroy(){
//   sessionStorage.setItem('pageRefreshed', 'false');
// }

// }


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

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabel, PasswordModule, IftaLabelModule, CardModule, CommonModule, ReactiveFormsModule,
    TextareaModule, ButtonModule, MessageModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})
export class Login implements OnInit, AfterViewInit {
  userServise: UserServise = inject(UserServise)
  private destroyRef = inject(DestroyRef)
  messageService = inject(MessageService);
  user$?: UserModel | null
  error$?: HttpErrorResponse | null
  errorMessege: string = ''
  
  public googleClientId = environment.googleClientId;

  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  loginUser: LoginModel = new LoginModel();
  isproper: boolean = true;

  constructor(private ngZone: NgZone) { }

  ngOnInit() {
 
    this.userServise.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.user$ = data
      if (data !== null) {
        alert(`Login successful: ${data}`)
      }
    });

    this.userServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.error$ = data
      if (data === null) {
        this.errorMessege = ''
      } else {
        this.errorMessege = data.error
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
        callback: (window as any).handleCredentialResponse
      });

      google.accounts.id.renderButton(
        document.getElementById("googleBtn"),
        { theme: "outline", size: "large", width: "100%" }
      );
    } else {
      setTimeout(() => this.renderGoogleButton(), 100);
    }
  }

  onSignIn(response: any) {
    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('ID: ' + payload.sub);
    console.log('Full Name: ' + payload.name);
    console.log('Email: ' + payload.email);
    console.log('Image URL: ' + payload.picture);
  }


  onSubmit() {
    if (this.loginForm.valid) {
      this.isproper = true;
      this.loginUser.userName = this.loginForm.value.email || ''
      this.loginUser.userPassward = this.loginForm.value.password || ''
      this.userServise.LoginUser(this.loginUser)
      this.loginForm.reset()
    }
  }
}
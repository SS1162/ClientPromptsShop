
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
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { RegisterUserModel } from '../../Models/RegisterUserModel';

declare var google: any;

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, InputTextModule, FloatLabel, PasswordModule, IftaLabelModule, CardModule, CommonModule, ReactiveFormsModule,
    TextareaModule, ButtonModule, MessageModule, ToastModule,
  ],
  providers: [MessageService],
  templateUrl: './login.html',
  styleUrls: ['./login.scss'],
})


export class Login implements OnInit, AfterViewInit {
  userServise: UserServise = inject(UserServise)
  destroyRef = inject(DestroyRef)
  router = inject(Router);
  messageService = inject(MessageService);
  location: Location = inject(Location);
  user$?: UserModel | null
  error$?: HttpErrorResponse | null
  errorMessege: string = ''
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
        this.flag = false
        if (window.history.length > 1) {
          this.location.back();
        }
        else {
          this.router.navigate(['/home']);
        }
      }
    });

    this.userServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.error$ = data
      if (data === null) {
        this.errorMessege = ''
      } else {
        this.errorMessege ="error accuard try again later"
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
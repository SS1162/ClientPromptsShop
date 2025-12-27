import { Component, inject } from '@angular/core';
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
import { FormBuilder } from '@angular/forms';
import { TextareaModule } from 'primeng/textarea';
import { MessageModule } from 'primeng/message';
import { ToastModule } from 'primeng/toast';
import { MessageService } from 'primeng/api';
import { environment } from '../../../environments/environment';
import { OnInit, NgZone } from '@angular/core';

import { LoginModel } from '../../Models/LoginModel';
import { UserServise } from '../../Servises/UserServise/User-servise';
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


export class Login {

  constructor(private ngZone: NgZone) { }

  public googleClientId = environment.googleClientId;

  ngOnInit() {

    window.addEventListener('google-login-success', (event: any) => {
      this.ngZone.run(() => {
        this.onSignIn(event.detail);
      });
    });


    if (!sessionStorage.getItem('pageRefreshed')) {
      sessionStorage.setItem('pageRefreshed', 'true');
      setTimeout(() => {


        location.reload();


      }, 3000)
    }

  }

  onSignIn(response: any) {

    const payload = JSON.parse(atob(response.credential.split('.')[1]));
    console.log('ID: ' + payload.sub);
    console.log('Full Name: ' + payload.name);
    console.log('Email: ' + payload.email);
    console.log('Image URL: ' + payload.picture);
  }


  loginForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required])
  })

  loginUser: LoginModel = new LoginModel();
  messageService = inject(MessageService);
  userServise = inject(UserServise);
  isproper: boolean = true;
  onSubmit() {
    if (this.loginForm.valid) {
      this.isproper = true;
      this.loginUser.userName = this.loginForm.value.email || ''
      this.loginUser.userPassward = this.loginForm.value.password || ''
      this.userServise.LoginUser(this.loginUser).subscribe( {
        next:(response)=>{
          sessionStorage.setItem('user', JSON.stringify(response.body))
          alert(`Login successful: ${response.body}`)
          this.loginForm.reset()
        },
        error:(err)=>{
        console.log(err);
          this.isproper = false
          this.loginForm.reset()
        }
      });
      //לחזור לקומפוננטה הקודמת


    }
  }





}



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
import { loginModel } from '../../Models/loginModel';
@Component({
  selector: 'app-register',
  imports: [FormsModule, InputTextModule, FloatLabel, PasswordModule, IftaLabelModule, CardModule, CommonModule, ReactiveFormsModule,
    TextareaModule, ButtonModule, MessageModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {



  RegisterForm = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required]),
    Phone: new FormControl(''),
    verificationPassword: new FormControl('', [Validators.required,]),
    firstName: new FormControl(''),
    secondName: new FormControl('', [Validators.minLength(10), Validators.maxLength(10)] ),
  })
   messageService = inject(MessageService);

   onSubmit(){
if (this.RegisterForm.valid){

this.messageService.add({ severity: 'success', summary: 'Login Successful', detail: 'Welcome back!' });
 this.RegisterForm.reset();
}
 }

}

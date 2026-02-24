import { Component, DestroyRef, inject, OnInit } from '@angular/core';
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
import { UpdateUserModel } from '../../Models/UpdateUserModel';
import { PasswordServise } from '../../Servises/passwordServise/password-servise';
import { RegisterUserModel } from '../../Models/RegisterUserModel';
import { PasswardModel } from '../../Models/PasswardModel';
import { UserServise } from '../../Servises/UserServise/User-servise';
import { CheckVertifictionPassword } from '../../Validators/passwords';
import { checkIfThePhoneValid } from '../../Validators/phone';
import { UserModel } from '../../Models/UserModel';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { HttpErrorResponse } from '@angular/common/http';
import { Router, RouterModule } from '@angular/router';
import { CheckboxModule } from 'primeng/checkbox';
@Component({
  selector: 'app-register',
  imports: [FormsModule, InputTextModule, FloatLabel, PasswordModule, IftaLabelModule, CardModule, CommonModule, ReactiveFormsModule,
    TextareaModule, ButtonModule, MessageModule, ToastModule, CheckboxModule, RouterModule
  ],
  providers: [MessageService],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register implements OnInit {
  userServise: UserServise = inject(UserServise)
  private destroyRef = inject(DestroyRef)
  user$?: UserModel | null
  error$?: HttpErrorResponse | null
  router: Router = inject(Router)

  ngOnInit() {

    this.userServise.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.error$ = data
      if (data !== null && data !== undefined) {
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: 'An error occurred. Please try again later.',
          life: 4000
        });
      }
    })

    this.userServise.sucssesToRegister.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: (data) => {
        if (data === true) {
          this.messageService.add({
            severity: 'success',
            summary: 'Account Created',
            detail: 'Your account has been created successfully! Redirecting to login...',
            life: 2500
          });
          setTimeout(() => this.router.navigate(['/login']), 2500);
        }
      },
      error: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Registration Failed',
          detail: 'An error occurred. Please try again later.',
          life: 4000
        });
      }
    })

  }

  passwordServise: PasswordServise = inject(PasswordServise);
  RegisterForm = new FormGroup({
    email: new FormControl(null, [Validators.required, Validators.email]),
    password: new FormControl(null, [Validators.required]),
    Phone: new FormControl(null, [checkIfThePhoneValid]),
    verificationPassword: new FormControl(null, [Validators.required]),
    firstName: new FormControl(null),
    secondName: new FormControl(null),
    acceptPrivacyPolicy: new FormControl(false, [Validators.requiredTrue]),
  }, { validators: CheckVertifictionPassword })

  messageService = inject(MessageService);
  registerUser: RegisterUserModel = new RegisterUserModel();

  onSubmit() {
    if (this.RegisterForm.valid) {
      this.registerUser.userPassword = this.RegisterForm.get('password')?.value || '';
      this.registerUser.userName = this.RegisterForm.get('email')?.value || '';
      this.registerUser.firstName = this.RegisterForm.get('firstName')?.value || '';
      this.registerUser.lastName = this.RegisterForm.get('secondName')?.value || '';
      this.registerUser.phone = this.RegisterForm.get('Phone')?.value || '';
      this.RegisterForm.reset()
      this.userServise.RegisterUser(this.registerUser)
      

      
    }

  }
   
  password: PasswardModel = new PasswardModel()
  passordStrength: number = 0
  checkPasswordStrength() {
    this.password.UserPassward = this.RegisterForm.get('password')?.value || '';
    if (this.password.UserPassward !== '') {
      this.passwordServise.postPassword(this.password).pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
        next: (response) => {
          this.passordStrength = response.body || 0
        }
        , error: (err) => {
          console.log(err)
        }
      })
    }

  }
 
}

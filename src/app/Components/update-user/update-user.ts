
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
import { PasswordService } from '../../Services/password/password.service';
import { PasswordModel } from '../../Models/PasswordModel';
import { UserService } from '../../Services/user/user.service';
import { UserModel } from '../../Models/UserModel';
import { CheckVertifictionPassword } from '../../Validators/passwords';
import { checkIfThePhoneValid } from '../../Validators/phone';
import { HttpErrorResponse } from '@angular/common/http';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-update-user',
  imports: [FormsModule, InputTextModule, FloatLabel, PasswordModule, IftaLabelModule, CardModule, CommonModule, ReactiveFormsModule,
    TextareaModule, ButtonModule, MessageModule, ToastModule
  ],
  providers: [MessageService],
  templateUrl: './update-user.html',
  styleUrl: './update-user.scss',
})


export class UpdateUser implements OnInit {

  userService: UserService = inject(UserService)
  private destroyRef = inject(DestroyRef)
  user$: UserModel | null = null
  error$: HttpErrorResponse | null = null
  errorMessege: string = ''
  ngOnInit() {
    this.userService.user$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.user$ = data

      this.UpdateForm.patchValue({
        email: this.user$?.userName
      });
    })

    this.userService.error$.pipe(takeUntilDestroyed(this.destroyRef)).subscribe(data => {
      this.error$ = data
      if (data === null) {
        this.errorMessege = ''
      }
      else {
        this.errorMessege = data.error
      }
    })
  }
  passwordService: PasswordService = inject(PasswordService);
  UpdateForm = new FormGroup({
    email: new FormControl({ value: `${this.user$?.userName}`, disabled: true }, Validators.required),
    password: new FormControl(null, [Validators.required]),
    Phone: new FormControl(null, [checkIfThePhoneValid]),
    verificationPassword: new FormControl(null, [Validators.required]),
    firstName: new FormControl(null),
    secondName: new FormControl(null),
  }, { validators: CheckVertifictionPassword })
  messageService = inject(MessageService);
  updateUser: UpdateUserModel = new UpdateUserModel();
  onSubmit() {
    if (this.UpdateForm.valid) {
      if (this.user$ === null) {
        this.errorMessege = "You must login before update ditels"
      }
      else {
        this.updateUser.userID = this.user$.userID
        this.updateUser.userName = this.user$.userName
        this.updateUser.password = this.UpdateForm.get('password')?.value || '';
        this.updateUser.firstName = this.UpdateForm.get('firstName')?.value || '';
        this.updateUser.lastName = this.UpdateForm.get('secondName')?.value || '';
        this.updateUser.phone = this.UpdateForm.get('Phone')?.value || '';
        this.userService.UpdaterUser(this.updateUser, this.user$.userID)
      }

    }
  }


  password: PasswordModel = new PasswordModel()
  passordStrength: number = 0
  checkPasswordStrength() {
    this.password.UserPassward = this.UpdateForm.get('password')?.value || '';
    if (this.password.UserPassward !== '') {
      this.passwordService.postPassword(this.password).subscribe({
        next: (response) => {
          this.passordStrength = response.body || 0
        }
        , error: (err) => {
          console.error(err)
        }
      })
    }

  }
}

import { AbstractControl, ValidationErrors } from "@angular/forms";

export function VerificationPassword(password:AbstractControl,VerificationPassword:AbstractControl):null|ValidationErrors
{
  const passwordString =password.value as string
  const VerificationPasswordSreing=VerificationPassword.value as string
  if(passwordString===VerificationPasswordSreing)
    return null
return {'diffrentPasswords':true}
}
import { AbstractControl, ValidationErrors } from "@angular/forms";

export function VerificationPassword(group:AbstractControl):null|ValidationErrors
{
  const passwordString:string =group.get('password')?.value as string
  const VerificationPasswordString:string=group.get('verificationPassword')?.value as string
  if(passwordString===VerificationPasswordString)
    return null
return {'diffrentPasswords':true}
}
import { AbstractControl, ValidationErrors } from "@angular/forms";

export function CheckVertifictionPassword(from:AbstractControl):null|ValidationErrors
{
const passwordString =from.get('password')?.value
  const VerificationPasswordSreing=from.get('verificationPassword')?.value
  if(passwordString===VerificationPasswordSreing)
    return null
return {'diffrentPasswords':true}
}
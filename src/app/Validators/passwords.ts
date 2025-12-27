import { AbstractControl, ValidationErrors } from "@angular/forms";

export function CheckVertifictionPassword(from:AbstractControl):null|ValidationErrors
{
const passwordString =from.get('password')
  const VerificationPasswordSreing=from.get('verificationPassword')
  if(passwordString===VerificationPasswordSreing)
    return null
return {'diffrentPasswords':true}
}
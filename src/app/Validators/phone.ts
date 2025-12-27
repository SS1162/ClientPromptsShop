import { NgTemplateOutlet } from "@angular/common";
import { AbstractControl, ValidationErrors } from "@angular/forms";

export function checkIfThePhoneValid(control:AbstractControl):null|ValidationErrors{
const phone=control.value as string||''
if(phone.length>10||phone.length<9||phone[0]!='0')
    return {'thePhoneIsValid':true}
for(let i=0;i<phone.length;i++)
{
    if(phone.charCodeAt(i)<48||phone.charCodeAt(i)>57)
    {
            return {'thePhoneIsValid':true}
    }
      
}
return null
}
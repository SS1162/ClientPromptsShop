import { Injectable } from '@angular/core';
import { loginModel } from '../../../Models/loginModel';

@Injectable({
  providedIn: 'root',
})
export class LoginServise {
 loginUser:loginModel=new loginModel();

}


import { HttpClient, HttpErrorResponse, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, switchMap } from 'rxjs';
import { geminiPromptModel } from '../../Models/geminiPromptModel';

@Injectable({
  providedIn: 'root',
})
export class GeminiServise {
  http:HttpClient=inject(HttpClient)
  BASIC_URL: string = `${environment.apiUrl}/Gemini`

addNewProduct(productId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>
{
  let params=new HttpParams()
  .set('productId',productId)
   .set('userRequest',userRequest)

return this.http.get<geminiPromptModel>(this.BASIC_URL+"ProductPrompt",{params:params,observe:'response'})

}
deletePrompt(promptID:number){
 this.http.delete<void>(this.BASIC_URL+promptID)
}


updateProductPrompt(promptId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
return this.http.put<void>(`${this.BASIC_URL}/ProductPrompt/${promptId}`,userRequest,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}


AddBasicSitePrompt(userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
  return this.http.get<geminiPromptModel>(this.BASIC_URL+"BasicSite",{observe:'response'})
}

updateBasicSitePrompt(promptId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
return this.http.put<void>(`${this.BASIC_URL}/BasicSite/${promptId}`,userRequest,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}


AddCategoryPrompt(userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
  return this.http.get<geminiPromptModel>(this.BASIC_URL+"Category",{observe:'response'})
}


updateCategoryPrompt(promptId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
return this.http.put<void>(`${this.BASIC_URL}/Category/${promptId}`,userRequest,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}
}

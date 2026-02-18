import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, switchMap } from 'rxjs';
import { geminiPromptModel } from '../../Models/geminiPromptModel';
import { GeminiInputModel } from '../../Models/GeminiInputModel';

@Injectable({
  providedIn: 'root',
})
export class GeminiServise {
  http:HttpClient=inject(HttpClient)
  BASIC_URL: string = `${environment.apiUrl}/Gemini`

addNewProduct(productId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>
{
  
const params =new GeminiInputModel()
params.categoryId=productId
params.userRequest=userRequest

return this.http.post<geminiPromptModel>(this.BASIC_URL+"/userProduct",params,{observe:'response'})

}
deletePrompt(promptID:number){
 return this.http.delete<void>(`${this.BASIC_URL}/${promptID}`)
}


updateProductPrompt(promptId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
   const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
return this.http.put<void>(`${this.BASIC_URL}/${promptId}/userProduct`,geminiInput,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}


AddBasicSitePrompt(userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
 const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
  return this.http.post<geminiPromptModel>(this.BASIC_URL+"/basicSite",geminiInput,{observe:'response'})
}

updateBasicSitePrompt(promptId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
  const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
return this.http.put<void>(`${this.BASIC_URL}/${promptId}/basicSite`,geminiInput,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}


AddCategoryPrompt(userRequest:string,categoryId:number):Observable<HttpResponse<geminiPromptModel>>{

const params =new GeminiInputModel()
params.categoryId=categoryId
params.userRequest=userRequest

  return this.http.post<geminiPromptModel>(this.BASIC_URL+"/category",params,{observe:'response'})
}


updateCategoryPrompt(promptId:number,userRequest:string):Observable<HttpResponse<geminiPromptModel>>{
 const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
return this.http.put<void>(`${this.BASIC_URL}/${promptId}/category`,geminiInput,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<geminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}
}

import { HttpClient, HttpErrorResponse, HttpHeaders, HttpParams, HttpResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { Observable, switchMap } from 'rxjs';
import { GeminiPromptModel } from '../../Models/GeminiPromptModel';
import { GeminiInputModel } from '../../Models/GeminiInputModel';

@Injectable({
  providedIn: 'root',
})
export class GeminiService {
  http:HttpClient=inject(HttpClient)
  BASIC_URL: string = `${environment.apiUrl}/Gemini`

addNewProduct(productId:number,userRequest:string):Observable<HttpResponse<GeminiPromptModel>>
{
  
const params =new GeminiInputModel()
params.categoryId=productId
params.userRequest=userRequest

return this.http.post<GeminiPromptModel>(this.BASIC_URL+"/userProduct",params,{observe:'response'})

}
deletePrompt(promptID:number){
 return this.http.delete<void>(`${this.BASIC_URL}/${promptID}`)
}


updateProductPrompt(promptId:number,userRequest:string):Observable<HttpResponse<GeminiPromptModel>>{
   const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
return this.http.put<void>(`${this.BASIC_URL}/${promptId}/userProduct`,geminiInput,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<GeminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}

getPrompt(promptId:number):Observable<HttpResponse<GeminiPromptModel>>{
  return this.http.get<GeminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
} 
AddBasicSitePrompt(userRequest:string):Observable<HttpResponse<GeminiPromptModel>>{
 const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
  return this.http.post<GeminiPromptModel>(this.BASIC_URL+"/basicSite",geminiInput,{observe:'response'})
}

updateBasicSitePrompt(promptId:number,userRequest:string):Observable<HttpResponse<GeminiPromptModel>>{
  const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
return this.http.put<void>(`${this.BASIC_URL}/${promptId}/basicSite`,geminiInput,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<GeminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}


AddCategoryPrompt(userRequest:string,categoryId:number):Observable<HttpResponse<GeminiPromptModel>>{

const params =new GeminiInputModel()
params.categoryId=categoryId
params.userRequest=userRequest

  return this.http.post<GeminiPromptModel>(this.BASIC_URL+"/category",params,{observe:'response'})
}


updateCategoryPrompt(promptId:number,userRequest:string):Observable<HttpResponse<GeminiPromptModel>>{
 const geminiInput:GeminiInputModel={
    userRequest:userRequest
  }
return this.http.put<void>(`${this.BASIC_URL}/${promptId}/category`,geminiInput,{observe:'response'})
.pipe(switchMap(()=>{
return this.http.get<GeminiPromptModel>(`${this.BASIC_URL}/${promptId}`,{observe:'response'})
}
))
}
}

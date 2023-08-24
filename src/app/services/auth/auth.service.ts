import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';
import { TokenModel } from 'src/app/models/tokenModel';
import { LoginModel } from 'src/app/models/auth/loginModel';
import { ApiUrls } from 'src/app/constants/urls';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private url = ApiUrls.ApiUrl + ApiUrls.Auth;

  constructor(private httpClient:HttpClient) { }

  login(loginModel:LoginModel):Observable<SingleResponseModel<TokenModel>>{
    let newPath = this.url + ApiUrls.Login;
    return this.httpClient.post<SingleResponseModel<TokenModel>>(newPath, loginModel);
  }
}

import { ApiUrls } from 'src/app/constants/urls';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { InvoiceUserModel } from 'src/app/models/user/invoiceUserModel';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  url = ApiUrls.ApiUrl + ApiUrls.Users;

  constructor(private httpClient:HttpClient) { }

  getAll():Observable<ListResponseModel<InvoiceUserModel>>{
    let newUrl = this.url + ApiUrls.UsersGetAll;
    return this.httpClient.get<ListResponseModel<InvoiceUserModel>>(newUrl);
  }
}

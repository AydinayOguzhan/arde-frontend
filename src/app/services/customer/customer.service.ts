import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from 'src/app/constants/urls';
import { CustomerModel } from 'src/app/models/customer/customerModel';
import { ListResponseModel } from 'src/app/models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
  url = ApiUrls.ApiUrl + ApiUrls.Customers;

  constructor(private httpClient:HttpClient) { }

  getAll():Observable<ListResponseModel<CustomerModel>>{
    let newUrl = this.url + ApiUrls.CustomersGetAll;
    return this.httpClient.get<ListResponseModel<CustomerModel>>(newUrl);
  }
}

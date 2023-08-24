import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { ApiUrls } from 'src/app/constants/urls';
import { CurrencyModel } from 'src/app/models/currency/currencyModel';
import { ListResponseModel } from 'src/app/models/listResponseModel';

@Injectable({
  providedIn: 'root'
})
export class CurrencyService {
  url = ApiUrls.ApiUrl + ApiUrls.Currencies;

  constructor(private httpClient:HttpClient) { }

  getAll():Observable<ListResponseModel<CurrencyModel>>{
    let newUrl = this.url + ApiUrls.CurrencyGetAll;
    return this.httpClient.get<ListResponseModel<CurrencyModel>>(newUrl);
  }
}

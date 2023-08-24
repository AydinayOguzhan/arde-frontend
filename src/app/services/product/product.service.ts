import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'src/app/constants/urls';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { ProductModel } from 'src/app/models/product/productModel';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private url = ApiUrls.ApiUrl + ApiUrls.Products;

  constructor(private httpClient:HttpClient) { }

  getAll():Observable<ListResponseModel<ProductModel>>{
    let newUrl = this.url + ApiUrls.ProductsGetAll;
    return this.httpClient.get<ListResponseModel<ProductModel>>(newUrl);
  }
}

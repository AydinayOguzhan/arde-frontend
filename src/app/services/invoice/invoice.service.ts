import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiUrls } from 'src/app/constants/urls';
import { ListResponseModel } from 'src/app/models/listResponseModel';
import { InvoiceListModel } from 'src/app/models/invoice/invoiceListModel';
import { ResponseModel } from 'src/app/models/responseModel';
import { InvoiceDetailModel } from 'src/app/models/invoice/invoiceDetailModel';
import { SingleResponseModel } from 'src/app/models/singleResponseModel';
import { InvoiceModel } from 'src/app/models/invoice/invoiceModel';

@Injectable({
  providedIn: 'root'
})
export class InvoiceService {
  private url = ApiUrls.ApiUrl + ApiUrls.Invoices;

  constructor(private httpClient:HttpClient) { }

  getAllList():Observable<ListResponseModel<InvoiceListModel>>{
    let newUrl = this.url + ApiUrls.InvoicesGetAllList;
    return this.httpClient.get<ListResponseModel<InvoiceListModel>>(newUrl);
  }

  delete(invoiceId:number):Observable<ResponseModel>{
   let newUrl = this.url + ApiUrls.InvoiceDelete + `?invoiceId=${invoiceId}`;
   return this.httpClient.delete<ResponseModel>(newUrl);
  }

  getAllInvoiceDetailsByInvoiceId(invoiceId:number):Observable<SingleResponseModel<InvoiceDetailModel>>{
    let newUrl = this.url + ApiUrls.InvoiceGetAllDetailsByInvoiceId + `?invoiceId=${invoiceId}`;
    return this.httpClient.get<SingleResponseModel<InvoiceDetailModel>>(newUrl);
  }

  update(invoiceDetails:InvoiceModel):Observable<ResponseModel>{
    let newUrl = this.url + ApiUrls.InvoiceUpdate;
    return this.httpClient.put<ResponseModel>(newUrl, invoiceDetails);
  }

  add(invoiceDetails:InvoiceModel):Observable<ResponseModel>{
    let newUrl = this.url + ApiUrls.InvoiceAdd;
    return this.httpClient.post<ResponseModel>(newUrl, invoiceDetails);
  }
}

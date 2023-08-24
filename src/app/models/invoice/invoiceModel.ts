import { InvoiceProductModel } from "../product/invoiceProductModel";

export interface InvoiceModel{
  invoiceId:number
  invoiceNo:number
  address:string
  createdDate:Date
  currency:string
  createdBy:number
  customerId:number
  products:InvoiceProductModel[]
}



import { CustomerModel } from "../customer/customerModel"
import { InvoiceProductModel } from "../product/invoiceProductModel"
import { InvoiceUserModel } from "../user/invoiceUserModel"

export interface InvoiceDetailModel{
  invoiceId:number
  invoiceNo:number
  address:string
  createdDate:Date
  currency:string
  createdBy:InvoiceUserModel
  customer:CustomerModel
  products:InvoiceProductModel[]
}



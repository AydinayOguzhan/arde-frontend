import { ToastrService } from 'ngx-toastr';
import { InvoiceListModel } from 'src/app/models/invoice/invoiceListModel';
import { InvoiceService } from './../../services/invoice/invoice.service';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Messages } from 'src/app/constants/messages';

@Component({
  selector: 'app-invoices',
  templateUrl: './invoices.component.html',
  styleUrls: ['./invoices.component.scss']
})
export class InvoicesComponent implements OnInit {
  invoiceList:InvoiceListModel[];
  isInvoiceList:boolean = false;

  constructor(private invoiceService:InvoiceService, private router:Router, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getAllInvoices();
  }

  getAllInvoices(){
    this.invoiceService.getAllList().subscribe(response=>{
      if (response.success) {
        this.invoiceList = response.data;
        this.isInvoiceList = true;
      }else{
        this.toastr.error(response.message);
      }
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
    });
  }

  delete(invoiceId:number){
    this.invoiceService.delete(invoiceId).subscribe(response=>{
      if (response.success) {
        this.toastr.success(response.message, "",{timeOut:500}).onHidden.subscribe(()=>{window.location.reload()});
      }else{
        this.toastr.error(response.message);
      }
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
    });
  }

  openUpdatePage(invoiceId:number){
    this.router.navigate([`updateinvoice/${invoiceId}`]);
  }

  openAddPage(){
    this.router.navigate(["addinvoice"]);
  }
}

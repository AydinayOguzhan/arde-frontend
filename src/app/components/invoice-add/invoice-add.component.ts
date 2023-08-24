import { Validators } from '@angular/forms';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { RouteReuseStrategy, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Messages } from 'src/app/constants/messages';
import { CustomerModel } from 'src/app/models/customer/customerModel';
import { ProductModel } from 'src/app/models/product/productModel';
import { InvoiceUserModel } from 'src/app/models/user/invoiceUserModel';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { ProductService } from 'src/app/services/product/product.service';
import { UserService } from 'src/app/services/user/user.service';
import { CurrencyService } from 'src/app/services/currency/currency.service';
import { CurrencyModel } from 'src/app/models/currency/currencyModel';
import { InvoiceProductModel } from 'src/app/models/product/invoiceProductModel';
import { InvoiceModel } from 'src/app/models/invoice/invoiceModel';

@Component({
  selector: 'app-invoice-add',
  templateUrl: './invoice-add.component.html',
  styleUrls: ['./invoice-add.component.scss']
})
export class InvoiceAddComponent implements OnInit {
  invoiceForm:FormGroup;

  users:InvoiceUserModel[];
  customers:CustomerModel[];
  products:ProductModel[];
  currencies:CurrencyModel[];

  isUserLoaded:boolean = false;
  isCustomerLoaded:boolean = false;
  isProductLoaded:boolean = false;
  isCurrencyLoaded:boolean = false;

  selectedProducts:InvoiceProductModel[] = [];
  selectedProductForm:FormGroup;

  grandTotal:number = 0;

  constructor(private userService:UserService, private customerService:CustomerService, private productService:ProductService,
    private toastr:ToastrService, private router:Router, private invoiceService:InvoiceService, private formBuilder:FormBuilder,
    private currencyService:CurrencyService) { }

  ngOnInit(): void {
    this.getAllUsers();
    this.getAllCustomers();
    this.getAllProducts();
    this.getAllCurrencies();
    this.createInvoiceForm();
    this.createSelectedProductForm();
  }

  createInvoiceForm(){
    this.invoiceForm = this.formBuilder.group({
      createdBy: ["0", Validators.required],
      customerId: ["0", Validators.required],
      invoiceNo:["0", Validators.required],
      address: ["", Validators.required],
      createdDate: ["", Validators.required],
      currency: ["TL", Validators.required],
    });
  }


  createSelectedProductForm(){
    this.selectedProductForm = this.formBuilder.group({
      productId: ["0", Validators.required],
      productQuantity: ["0", [Validators.required, Validators.min(1)]],
    });
  }

  openAddSelectedProductModal(){
  }

  getAllUsers(){
    this.userService.getAll().subscribe(response=>{
      if (response.success) {
        this.users = response.data;
        this.isUserLoaded = true;
      }else{
        this.isUserLoaded = false;
      }
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
      this.isUserLoaded = false;
    });
  }

  getAllCustomers(){
    this.customerService.getAll().subscribe(response=>{
      if (response.success) {
        this.customers = response.data;
        this.isCustomerLoaded = true;
      }else{
        this.isCustomerLoaded = false;
      }
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
      this.isCustomerLoaded = false;
    });
  }

  getAllProducts(){
    this.productService.getAll().subscribe(response=>{
      if (response.success) {
        this.products = response.data;
        this.isProductLoaded = true;
      }else{
        this.isProductLoaded = false;
      }
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
      this.isProductLoaded = false;
    });
  }

  getAllCurrencies(){
    this.currencyService.getAll().subscribe(response=>{
      if (response.success) {
        this.currencies = response.data;
        this.isCurrencyLoaded = true;
      }else{
        this.isCurrencyLoaded = false;
      }
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
      this.isCurrencyLoaded = false;
    });
  }

  addSelectedProduct(){
    if (this.selectedProductForm.valid) {
      let formValue = Object.assign({}, this.selectedProductForm.value);
      this.products.forEach(product => {
        if (formValue.productId == product.id) {
          let newProduct:InvoiceProductModel = {productId: product.id, name: product.name, unitPrice: product.unitPrice, quantity: formValue.productQuantity,
          invoiceProductId:0, lineTotal:product.unitPrice * formValue.productQuantity};
          this.selectedProducts.push(newProduct);
          this.calculateGrandTotal();
        }
      });
    }else{
      this.toastr.error(Messages.FillTheBlanks);
    }
  }

  deleteFromSelectedProduct(productId:number){
    this.selectedProducts.forEach((product, index)=>{
      if (productId == product.productId) {
        this.selectedProducts.splice(index, 1);
        this.calculateGrandTotal();
      }
    });
  }

  calculateGrandTotal(){
    this.grandTotal = 0;
    this.selectedProducts.forEach(product => {
      this.grandTotal += product.lineTotal;
    });
  }

  createInvoice(){
    if (this.invoiceForm.valid && this.selectedProducts.length > 0) {
      let formValue = Object.assign({}, this.invoiceForm.value);
      console.log(formValue.customerId)

      let invoice: InvoiceModel = {
        address: formValue.address,
        createdBy: formValue.createdBy,
        createdDate: formValue.createdDate,
        currency: formValue.currency,
        customerId: formValue.customerId,
        invoiceId: 0,
        invoiceNo: formValue.invoiceNo,
        products: this.selectedProducts
      }

      console.log(invoice)
      this.invoiceService.add(invoice).subscribe(response=>{
        if (response.success) {
          this.toastr.success(response.message, "", {timeOut:500}).onHidden.subscribe(()=>{this.router.navigate(["mainpage"])});
        }else{
          this.toastr.error(response.message);
        }
      },errorResponse=>{
        this.toastr.error(Messages.SomethingWentWrong);
      });

      console.log(invoice)
    }else{
      this.toastr.error(Messages.FillTheBlanks);
    }
  }

  cancel(){
    this.router.navigate(["mainpage"]);
  }
}

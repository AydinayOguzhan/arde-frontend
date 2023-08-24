import { InvoiceProductModel } from './../../models/product/invoiceProductModel';
import { Validators } from '@angular/forms';
import { FormGroup } from '@angular/forms';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { InvoiceService } from 'src/app/services/invoice/invoice.service';
import { InvoiceDetailModel } from 'src/app/models/invoice/invoiceDetailModel';
import { ProductService } from 'src/app/services/product/product.service';
import { ProductModel } from 'src/app/models/product/productModel';
import { Messages } from 'src/app/constants/messages';
import { UserService } from 'src/app/services/user/user.service';
import { InvoiceUserModel } from 'src/app/models/user/invoiceUserModel';
import { CustomerService } from 'src/app/services/customer/customer.service';
import { CustomerModel } from 'src/app/models/customer/customerModel';
import { InvoiceModel } from 'src/app/models/invoice/invoiceModel';

@Component({
  selector: 'app-invoice-update',
  templateUrl: './invoice-update.component.html',
  styleUrls: ['./invoice-update.component.scss']
})
export class InvoiceUpdateComponent implements OnInit {
  invoiceId: number;
  isLoaded: boolean = false;
  invoiceDetails: InvoiceDetailModel;
  grandTotal:number = 0;

  products:ProductModel[];
  isProductsLoaded:boolean = false;
  addProductForm:FormGroup;

  invoiceProductToUpdate:InvoiceProductModel;
  isInvoiceProductToUpdateLoaded:boolean = false;
  invoiceProductUpdateForm:FormGroup;

  users:InvoiceUserModel[];
  isUsersLoaded:boolean = false;
  selectedUser:InvoiceUserModel;

  customers:CustomerModel[];
  isCustomersLoaded:boolean = false;
  selectedCustomer:CustomerModel;

  constructor(private activatedRoute: ActivatedRoute, private invoiceService: InvoiceService, private toastr: ToastrService,
    private router:Router, private productService:ProductService, private formBuilder:FormBuilder, private userService:UserService,
    private customerService:CustomerService) { }

  ngOnInit(): void {
    this.activatedRoute.params.subscribe(params => {
      if (params["invoiceId"]) {
        this.invoiceId = params["invoiceId"];
        this.getInvoiceDetails(this.invoiceId);
      }
    })
  }

  getInvoiceDetails(invoiceId: number) {
    this.invoiceService.getAllInvoiceDetailsByInvoiceId(invoiceId).subscribe(response => {
      if (response.success) {
        this.invoiceDetails = response.data;
        this.isLoaded = true;

        console.log(this.invoiceDetails)
        this.calculateGrandTotal();
      }else{
        this.isLoaded = false;
      }
    }, errorResponse => {
      this.isLoaded = false;
    });
  }

  calculateGrandTotal(){
    this.grandTotal = 0;
    this.invoiceDetails.products.forEach(product => {
      this.grandTotal += product.lineTotal;
    });
  }

  cancel(){
    this.router.navigate(["mainpage"]);
  }

  getAllProducts(){
    this.productService.getAll().subscribe(response=>{
      if (response.success) {
        if (this.products === undefined) {
          this.products = response.data;
          this.isProductsLoaded = true;
          this.createAddProductForm();
        }
      }else{
        this.isProductsLoaded = false;
        this.toastr.error(response.message);
      }
    }, errorResponse=>{
      this.isProductsLoaded = false;
      this.toastr.error(Messages.SomethingWentWrong);
    });
  }

  createAddProductForm(){
    this.addProductForm = this.formBuilder.group({
      productId:["0", Validators.required],
      productQuantity:["", [Validators.required, Validators.min(1)]]
    })
  }

  addNewProductToInvoice(){
    if (this.addProductForm.valid) {
      let formValue = Object.assign({}, this.addProductForm.value);

      this.products.forEach(product => {
        if (formValue.productId == product.id) {
          let newProduct:InvoiceProductModel = {
            productId: formValue.productId,
            name: product.name,
            quantity: formValue.productQuantity,
            unitPrice: product.unitPrice,
            lineTotal: formValue.productQuantity * product.unitPrice,
            invoiceProductId:0
          };
          this.invoiceDetails.products.push(newProduct);
          this.calculateGrandTotal();
        }
      });

    }else{
      this.toastr.error(Messages.FillTheBlanks);
    }
  }

  openUpdateProductModal(invoiceProduct:InvoiceProductModel){
    this.invoiceProductToUpdate = invoiceProduct;
    this.isInvoiceProductToUpdateLoaded = true;
    this.createInvoiceProductUpdateForm();
  }

  updateProduct(){
    if (this.invoiceProductUpdateForm.valid) {
      let formValue = Object.assign({}, this.invoiceProductUpdateForm.value);
      this.invoiceProductToUpdate.quantity = formValue.productQuantity;

      this.invoiceDetails.products.forEach(product => {
        if (this.invoiceProductToUpdate.invoiceProductId == product.invoiceProductId && this.invoiceProductToUpdate.productId == product.productId) {
          product.quantity = this.invoiceProductToUpdate.quantity;
          product.lineTotal = this.invoiceProductToUpdate.quantity * product.unitPrice;
          this.calculateGrandTotal();
        }
      });
    }
  }

  createInvoiceProductUpdateForm(){
    this.invoiceProductUpdateForm = this.formBuilder.group({
      productQuantity: [this.invoiceProductToUpdate.quantity, [Validators.required, Validators.min(1)]],
    });
  }

  deleteInvoiceProduct(invoiceProductId:number){
    this.invoiceDetails.products.forEach((product, index)=>{
      if (product.invoiceProductId == invoiceProductId) {
        this.invoiceDetails.products.splice(index, 1);
        this.calculateGrandTotal();
      }
    });
  }

  openChangeCreatedByModel(){
    this.getAllUsers();
  }

  getAllUsers(){
    this.userService.getAll().subscribe(response=>{
      if (response.success) {
        this.users = response.data;
        this.isUsersLoaded = true;

        console.log(this.users)
      }else{
        this.isUsersLoaded = false;
      }
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
    });
  }

  updateCreatedBy(){
    this.invoiceDetails.createdBy = this.selectedUser;
  }

  changeSelectedUser(event:any){
    this.users.forEach(user=>{
      if (user.userId == event.target.value) {
        this.selectedUser = user;
      }
    })
  }

  openCustomerUpdateModal(){
    this.getAllCustomers();
  }

  getAllCustomers(){
    this.customerService.getAll().subscribe(response=>{
      if (response.success) {
        this.customers = response.data;
        this.isCustomersLoaded = true;
      }else{
        this.isCustomersLoaded = false;
      }
    },errorResponse=>{
      this.isCustomersLoaded = false;
      this.toastr.error(Messages.SomethingWentWrong);
    });
  }

  changeSelectedCustomer(event:any){
    this.customers.forEach(customer=>{
      if (customer.id == event.target.value) {
        this.selectedCustomer = customer;
      }
    });
  }

  updateCustomer(){
    this.invoiceDetails.customer = this.selectedCustomer;
  }

  updateAll(){
    let invoice:InvoiceModel = {
      invoiceNo: this.invoiceDetails.invoiceNo,
      invoiceId: this.invoiceDetails.invoiceId,
      address: this.invoiceDetails.address,
      createdDate:this.invoiceDetails.createdDate,
      currency: this.invoiceDetails.currency,
      products: this.invoiceDetails.products,
      createdBy: this.invoiceDetails.createdBy.userId,
      customerId: this.invoiceDetails.customer.id
    }

    this.invoiceService.update(invoice).subscribe(response=>{
      if (response.success) {
        this.toastr.success(response.message, "", {timeOut:500}).onHidden.subscribe(()=>{this.router.navigate(["mainpage"])});
      }else{
        this.toastr.error(response.message);
      }
    },errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
    });
  }
}

import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { ProductService } from 'src/app/services/product/product.service';
import { Messages } from 'src/app/constants/messages';
import { ProductModel } from 'src/app/models/product/productModel';

@Component({
  selector: 'app-products',
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {
  products:ProductModel[];
  isLoaded:boolean = false;

  constructor(private productService:ProductService, private toastr:ToastrService) { }

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts(){
    this.productService.getAll().subscribe(response=>{
      this.products = response.data;
      this.isLoaded = true;

      console.log(this.products)
    }, errorResponse=>{
      this.toastr.error(Messages.SomethingWentWrong);
    });
  }
}

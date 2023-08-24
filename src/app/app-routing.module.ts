import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MainPageComponent } from './components/main-page/main-page.component';
import { ProductsComponent } from './components/products/products.component';
import { InvoicesComponent } from './components/invoices/invoices.component';
import { LoginGuard } from './guards/login/login.guard';
import { InvoiceUpdateComponent } from './components/invoice-update/invoice-update.component';
import { InvoiceAddComponent } from './components/invoice-add/invoice-add.component';

const routes: Routes = [
  {path:"", component:LoginComponent},
  {path:"login", component:LoginComponent},

  {path:"mainpage", component:MainPageComponent, canActivate:[LoginGuard]},

  {path:"addinvoice", component:InvoiceAddComponent},
  {path:"updateinvoice/:invoiceId", component:InvoiceUpdateComponent},

  {path:"products", component:ProductsComponent, canActivate:[LoginGuard]},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

import { LoginModel } from './../../models/auth/loginModel';
import { AuthService } from './../../services/auth/auth.service';
import { ToastrService } from 'ngx-toastr';
import { Component, OnInit } from '@angular/core';
import { Messages } from 'src/app/constants/messages';
import { FormGroup, FormControl, Validators, FormBuilder } from "@angular/forms";
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;

  constructor(private toastr:ToastrService, private authService:AuthService, private formBuilder:FormBuilder,
    private router:Router) { }

  ngOnInit(): void {
    this.createLoginForm();
  }

  createLoginForm(){
    this.loginForm = this.formBuilder.group({
      email:["",Validators.required],
      password:["",Validators.required]
    })
  }

  handleLogin(){
    if (this.loginForm.valid) {
      let loginObj = Object.assign({}, this.loginForm.value);
      this.authService.login(loginObj).subscribe((response)=>{
        console.log(response)
        if (response.success) {
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("expiration", response.data.expiration);

          this.toastr.success(Messages.Successful,"",{timeOut:500}).onHidden.subscribe(()=>{this.router.navigate(["/mainpage"])});
        }else{
          this.toastr.error(response.message);
        }
      }, errorResponse => {
        this.toastr.error(Messages.SomethingWentWrong);
      });
    }
  }
}

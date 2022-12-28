import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../register/register.component';

export interface errorMessage{
  email: string[],
  password: string[]
}

export interface errors{
  required: string;
}

export interface errorMessages{
  email: errors,
  password: errors
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

  constructor(private formBuilder : FormBuilder, private authService:AuthService, private router: Router) { }

  ngOnInit(): void {
  }

  formErrors:errorMessage = {
    email: [],
    password: []
  }

  private validationMessages = {
    email: {required:'Filed required'},
    password: {required:'Filed required'}
  }
  
  loginForm = this.formBuilder.group({
    email: ['',[Validators.required]],
    password: ['',[Validators.required]],
  });

  clearErrors(){
    for (let field in this.formErrors) {
      this.formErrors[field as keyof errorMessage] = [];
    }
  }

  async submitForm(){
    this.clearErrors();
    let errors: boolean = false;

    if(!this.loginForm.valid){
      for (let field in this.formErrors) {
        this.formErrors[field as keyof errorMessage] = [];
        let control = this.loginForm.get(field); 
        if (control && !control.valid) {
          const validationMessages = this.validationMessages[field as keyof errorMessages];
          for (const key in control.errors) {
            this.formErrors[field as keyof errorMessage].push(validationMessages[key as keyof errors]);
          }
        }
  
      }
      errors = true;
    }

    if(errors){
      return
    }
    try{
      await this.authService.login(this.loginForm.get("email")!.value || "", this.loginForm.get("password")!.value || "")
    }catch(error:any){
      if(error?.code == "auth/wrong-password" || error?.code == "auth/invalid-email" || error?.code == "auth/user-not-found"){
        this.formErrors.password.push("Invalid password or email");
      }else if(error?.code == "auth/too-many-requests"){
        this.formErrors.password.push("Account temporairly blocked due to too many failed attempts. Try again later.");
      }
      else{
        alert("Something went wrong - make sure that all informations are correct and try again");
      }
      return
    }


    this.loginForm.reset();
    this.clearErrors();

  }
}





import { Component, OnInit } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { async } from '@firebase/util';
import { __values } from 'tslib';
import { AuthService } from '../auth.service';
export interface errorMessage{
  name: string[],
  email: string[],
  password: string[],
  repeatPassword: string[]
}

export interface errors{
  required: string;
}

export interface errorMessages{
  name: errors,
  email: errors,
  password: errors,
  repeatPassword: errors
}

export interface User{
  name: string,
  email: string,
  permissions: string
}

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

  constructor(private formBuilder : FormBuilder, private auth:AuthService,private router: Router) { 

  }

  ngOnInit(): void {
  }

  formErrors:errorMessage = {
    name: [],
    email: [],
    password: [],
    repeatPassword: []
  }

  private validationMessages = {
    name: {required:'Filed required'},
    email: {required:'Filed required'},
    password: {required:'Filed required'},
    repeatPassword: {required:'Filed required'}
  }

  registerForm = this.formBuilder.group({
    name: ['',[Validators.required]],
    email: ['',[Validators.required]],
    password: ['',[Validators.required]],
    repeatPassword: ['',[Validators.required]]
  });
  
  passwordValidator = (password: string): boolean =>{
    if( ! (password.length >= 8) ) this.formErrors.password.push("Password must have at least 8 characters");
    if( ! (/[@$!%*#?&]+/.test(password)) ) this.formErrors.password.push("Password must have at least one special character");
    if( ! (/[A-Z]+/.test(password)) ) this.formErrors.password.push("Password must have at least one capital letter");
    if( ! (/[0-9]+/.test(password)) ) this.formErrors.password.push("Password must have at least one digit");
    return (password.length >= 8) && (/[@$!%*#?&]+/.test(password)) && (/[A-Z]+/.test(password)) && (/[0-9]+/.test(password));
  }

  emailValidator = (email: string): boolean =>{
    if(/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(email)) return true;
    this.formErrors.email.push("Invalid email");
    return false;
  }

  clearErrors(){
    for (let field in this.formErrors) {
      this.formErrors[field as keyof errorMessage] = [];
    }
  }


  async submitForm(){
    this.clearErrors();
    let errors: boolean = false;

    if(!this.registerForm.valid){
      for (let field in this.formErrors) {
        this.formErrors[field as keyof errorMessage] = [];
        let control = this.registerForm.get(field); 
        if (control && !control.valid) {
          const validationMessages = this.validationMessages[field as keyof errorMessages];
          for (const key in control.errors) {
            this.formErrors[field as keyof errorMessage].push(validationMessages[key as keyof errors]);
          }
        }
  
      }
      errors = true;
    }

    if(!this.passwordValidator(this.registerForm.get("password")!.value || "")){
      errors = true;
    } 

    if(!this.emailValidator(this.registerForm.get("email")!.value || "")){
      errors = true;
    } 

    if(this.registerForm.get("password")!.value != this.registerForm.get("repeatPassword")!.value){
      this.formErrors.repeatPassword.push("passowords have to match!")
      errors = true;
    }

    if(errors){
      return
    }

    let newUser = {
      name: this.registerForm.get("name")!.value || "",
      email: this.registerForm.get("email")!.value || "",
      permissions: "1000"
    }

    try {
      await this.auth.addUser(newUser.email || "" ,this.registerForm.get("password")!.value || "", newUser);
      this.router.navigate(['home']);
    }catch (error:any) {
      if(error?.code == "auth/email-already-in-use"){
        this.formErrors.email.push("Email already in use!");
      }else if(error?.message == "Invalid username"){
        this.formErrors.name.push("Username taken");
      }
      else{
        alert("Something went wrong - make sure that all informations are correct and try again")
      }
      return
    }

    this.registerForm.reset();
    this.clearErrors();

  }
}

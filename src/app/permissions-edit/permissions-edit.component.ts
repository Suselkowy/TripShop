import { Component, OnInit } from '@angular/core';
import { DocumentSnapshot } from '@angular/fire/compat/firestore';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { User } from '../register/register.component';
import { TripsService } from '../trips.service';

@Component({
  selector: 'app-permissions-edit',
  templateUrl: './permissions-edit.component.html',
  styleUrls: ['./permissions-edit.component.css']
})
export class PermissionsEditComponent implements OnInit {
  id:string = "";
  user:User | null = null;

  constructor(private formBuilder : FormBuilder, private _tripsService: TripsService, private router: Router, private route:ActivatedRoute, private authService:AuthService) { 
    this.init()
  }

  ngOnInit(): void {

  }
  
  init(){
    this.id =  this.route.snapshot.paramMap.get('id') || "";
    console.log(this.id);
    this.authService.getUserByID(this.id || "").subscribe(u => {
      this.user = u.data() as User;
      let perms = this.user.permissions;
      let permissionObj = {
        "permission--0":perms[0]=="1" ? "1" :"" ,
        "permission--1":perms[1]=="1" ? "1" :"" ,
        "permission--2":perms[2]=="1" ? "1" :"" ,
        "permission--3":perms[3]=="1" ? "1" :"" 
      }
      this.permissionForm.patchValue(permissionObj);
    });
  }

  permissionForm = this.formBuilder.group({
    "permission--0":'',
    "permission--1":'',
    "permission--2":'',
    "permission--3":''
  });

  submitForm(){
    let newPermsObj = {
      "0": this.permissionForm.get("permission--0")?.value == "1" ? "1" :"0" ,
      "1": this.permissionForm.get("permission--1")?.value == "1" ? "1" :"0" ,
      "2": this.permissionForm.get("permission--2")?.value == "1" ? "1" :"0" ,
      "3": this.permissionForm.get("permission--3")?.value == "1" ? "1" :"0" ,
    }
    this.authService.updatePermissions(newPermsObj["0"]+newPermsObj["1"]+newPermsObj["2"]+newPermsObj["3"], this.id);
    this.router.navigate(["admin"]);
  }


}

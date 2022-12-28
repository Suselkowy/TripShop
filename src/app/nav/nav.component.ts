import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService : AuthService) {
    authService.getUserData().subscribe(data => this.userData = data);
   }

  checked: boolean = false;
  userData :any = null;

  ngOnInit(): void {
  }

  changeCheckState(){
    this.checked = !this.checked;
  }

  logout(){
    this.authService.signOut();
  }

  
  logUser(){
    console.log(this.authService.isLoggedIn());
    console.log(this.userData);
    this.authService.log();
  }
}

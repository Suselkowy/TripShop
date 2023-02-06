import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';
import { TripsService } from '../trips.service';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class NavComponent implements OnInit {

  constructor(public authService : AuthService, private router: Router) {
    this.authService.getUserData().subscribe(data => this.userData = data);
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
    this.router.navigate(['/home']);
  }

  
  logUser(){
    console.log(this.authService.isLoggedIn());
    console.log(this.userData);
  }
}

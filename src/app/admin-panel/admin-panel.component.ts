import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { User } from '../register/register.component';

interface UserWithID extends User{
  key:string
}

export interface firestoreUser{
  payload: doc
}

interface doc{
  doc: d
}

interface d{
  data(): User,
  id: string
}

@Component({
  selector: 'app-admin-panel',
  templateUrl: './admin-panel.component.html',
  styleUrls: ['./admin-panel.component.css']
})
export class AdminPanelComponent implements OnInit {

  users:UserWithID[] = [];

  constructor(private authService: AuthService) { 
    this.authService.getUsers().subscribe((data) => {
      this.users = data.map((user:firestoreUser) =>({...user.payload.doc.data(), key:user.payload.doc.id}));
    })
  }

  ngOnInit(): void {
  }

}

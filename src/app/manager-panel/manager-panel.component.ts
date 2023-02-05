import { Component, OnInit } from '@angular/core';
import { AuthService } from '../auth.service';
import { CartService } from '../cart.service';
import { firestoreData } from '../trips-container/trips-container.component';
import { tripInfo, TripsService } from '../trips.service';

@Component({
  selector: 'app-manager-panel',
  templateUrl: './manager-panel.component.html',
  styleUrls: ['./manager-panel.component.css']
})
export class ManagerPanelComponent implements OnInit {
  trips: tripInfo[] = [];

  constructor(private _tripsService: TripsService, private _cartService: CartService, public authService: AuthService) { }

  ngOnInit(): void {
    this._tripsService.getData().subscribe(data => {
      this.trips = data.map( (trip: firestoreData) => ({...trip.payload.doc.data(),key:trip.payload.doc.id, "amount":this._cartService.getAmountOfItem(trip.payload.doc.data().id), "reviews":this._tripsService.getReview(Number(trip.payload.doc.data().id))}))
    });
  }

  removeTrip(trip:tripInfo){
    this._tripsService.deleteData(trip.key);
  }

  editTrip(trip:tripInfo){
    console.log("edit");
  }

}

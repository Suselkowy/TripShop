import { Component, OnInit, Output } from '@angular/core';
import { TripsService, tripInfo, tripInfoStart } from '../trips.service';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';
import { firestoreSnapshotData } from '../interfaces';

export interface firestoreData{
  payload: doc
}

interface doc{
  doc: d
}

interface d{
  data(): tripInfoStart,
  id: string
}



@Component({
  selector: 'app-trips-container',
  templateUrl: './trips-container.component.html',
  styleUrls: ['./trips-container.component.css'],
  providers: []
})
export class TripsContainerComponent implements OnInit {

  public trips:tripInfo[] = [];

  public sumAmount:number = 0;
  public formShown = 0;

  public filteredTrips:tripInfo[] = [];

  constructor(private _tripsService: TripsService, private _cartService: CartService, public authService: AuthService)
  { 
    console.log("const");
  }

  ngOnInit(): void {
    this._tripsService.getData().subscribe(data => {
      this.trips = data.map( (trip: firestoreSnapshotData) => ({...trip.payload.doc.data(),
        key:trip.payload.doc.id,
        "amount":this._cartService.getAmountOfItem(trip.payload.doc.data().id), 
        "reviews":this._tripsService.getReview(Number(trip.payload.doc.data().id))
      }) )
      this.filteredTrips = this.trips;
    });
    this._cartService.getSumOfQuantity2().subscribe(sumOfQuanitity => this.sumAmount = sumOfQuanitity)
    console.log("init");
  }

  //filter functionality
  filterTrips(filteredTrips:tripInfo[]){
    this.filteredTrips = filteredTrips;
  }

  //max and min price
  getMaxPrice(trips:tripInfo[]=this.trips):number{
    let maxPrice = 0;
    trips.forEach(trip=> {
      maxPrice = Math.max(trip.price, maxPrice)
    });
    return maxPrice;
  }

  getMinPrice(trips:tripInfo[]=this.trips):number{
    let minPrice = 9999999;
    trips.forEach(trip=> {
      minPrice = Math.min(trip.price, minPrice)
    });
    return minPrice;
  }

}

import { Component, OnInit } from '@angular/core';
import { TripsService, tripInfo, tripInfoStart } from '../trips.service';
import { searchArgs} from '../trip-filter/trip-filter.component';
import { CartService } from '../cart.service';
import { AuthService } from '../auth.service';

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
  public tripsTest:tripInfo[] = [];
  public sumAmount:number = 0;
  public searchArgs:searchArgs = {destCountry:"",minPrice:"",maxPrice:"",startDate:"",endDate:"", raiting:[]};
  public formShown = 0;

  constructor(private _tripsService: TripsService, private _cartService: CartService, public authService: AuthService) { }

  ngOnInit(): void {
    this._tripsService.getData().subscribe(data => {
      this.trips = data.map( (trip: firestoreData) => ({...trip.payload.doc.data(),key:trip.payload.doc.id, "amount":this._cartService.getAmountOfItem(trip.payload.doc.data().id), "reviews":this._tripsService.getReview(Number(trip.payload.doc.data().id))}))
    });
    this.getSumAmount();
  }

  changeSumAmount(num: number):void{
      this.sumAmount += num;
      console.log(this.trips);
  }

  getSumAmount():void{
    this.sumAmount = this._cartService.getSumOfQuantity();
  }

  changeSearchArgs(searchArgs:searchArgs){
    this.searchArgs = searchArgs;
  }

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

  removeTrip(trip:tripInfo){
    this._tripsService.deleteData(trip.key);
  }

  formSubmit(object:tripInfo){
    this.trips.push(object);
  }

  showForm(){
    this.formShown = 1;
  }

}

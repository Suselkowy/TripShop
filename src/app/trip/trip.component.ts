import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AuthService } from '../auth.service';
import { CartService} from '../cart.service';
import { tripInfo, TripsService } from '../trips.service';

@Component({
  selector: 'app-trip',
  templateUrl: './trip.component.html',
  styleUrls: ['./trip.component.css']
})
export class TripComponent implements OnInit {

  @Output() removeTrip = new EventEmitter<tripInfo>();

  @Input("data") data:tripInfo = { 
    key: "",
    id: -1, 
    name:"",
    destCountry:"",
    startDate:"",
    endDate:"",
    price:0,
    description:"",
    availableTrips: 0,
    imgLink:[],
    reviews:[],
    amount:0
  };

  constructor(private cartService: CartService, public authService: AuthService) {
  }
 
  ngOnInit(): void {
  }


  addTrip(){

    if(this.data.amount < this.data.availableTrips){
      this.data.amount += 1;
    }
  
  }

  subtractTrip(step = -1){
    if(this.data.amount > 0){
      this.data.amount -= 1;
    }
  }

  tripsLeft():number{
    return this.data.availableTrips - this.data.amount;
  }
  addToCart() {
    let newProduct = this.data;
    this.cartService.addToCart(newProduct);
  }

  deleteTrip():void{
    this.removeTrip.emit(this.data);
    this.subtractTrip(-this.data.amount);
    this.data.amount = 0;
    this.addToCart();
  }

}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartService } from '../cart.service';
import { firestoreSnapshotData } from '../interfaces';
import { Review, tripInfo, TripsService } from '../trips.service';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {

  public data:tripInfo = { 
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
    amount:0};
  tripId: string | null | undefined;
  currSlide:number = 0;

  constructor(private route: ActivatedRoute, private _tripsService: TripsService, private _cartService: CartService) { 
  }

  ngOnInit(): void {
    this.tripId =  this.route.snapshot.paramMap.get('id');
    this._tripsService.getData().subscribe(data => {
      this.data = data.map( (trip: firestoreSnapshotData) => ({...trip.payload.doc.data(),key:trip.payload.doc.id, "amount":this._cartService.getAmountOfItem(trip.payload.doc.data().id), "reviews":this._tripsService.getReview(Number(trip.payload.doc.data().id))})).filter((trip:tripInfo) => String(trip.id) == (this.tripId || ""))[0]
    });
  }

  tripsLeft():number{
    return this.data.availableTrips - this.data.amount;
  }

  addToCart() {
    let newProduct = this.data;
    this._cartService.addToCart(newProduct);
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

  nextSlide(){
    this.currSlide = (this.currSlide + 1)%this.data.imgLink.length; 
  }

  prevSlide(){
    this.currSlide = this.currSlide > 0 ? this.currSlide - 1 : this.data.imgLink.length-1;
  }

  passTripId(){
    return Number(this.tripId);
  }

  addReview(newReview:Review){
    this.data.reviews = [...this.data.reviews, newReview] 
  }
}

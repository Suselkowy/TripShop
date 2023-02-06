import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from '../cart.service';
import { firestoreSnapshotData } from '../interfaces';
import { Review, tripInfo, TripsService } from '../trips.service';
import {getTripInfoFromFirestore} from '../helpers';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.css']
})
export class TripDetailComponent implements OnInit {

  public trip:tripInfo = { 
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

  constructor(private route: ActivatedRoute, private _tripsService: TripsService, private _cartService: CartService, private router: Router) { 
  }

  ngOnInit(): void {
    this.tripId =  this.route.snapshot.paramMap.get('id');
    try{
      if(this.tripId){
        if(isNaN(Number(this.tripId))){
          throw new Error("Invalid id format")
        }
      }

      this._tripsService.getTrip(Number(this.tripId)).subscribe(data => {
        this.trip = getTripInfoFromFirestore(data, this._cartService, this._tripsService)[0];
        if(this.trip.id == -1){
          throw new Error("Trip not found")
        }
        this._tripsService.getReviewsSingleTrip(this.trip.id).subscribe(data => {
          this.trip.reviews =  data.map( raw => raw.payload.doc.data() )
        })
      });



    }catch(e){
      if(e instanceof Error){
        console.log(e.message);
      }
      this.router.navigate(['/error-404'], { skipLocationChange: true });
    }
  }

  tripsLeft():number{
    return this.trip.availableTrips - this.trip.amount;
  }

  addToCart() {
    this._cartService.addToCart(this.trip);
  }

  addTrip(){
    if(this.trip.amount < this.trip.availableTrips){
      this.trip.amount += 1;
    }
  }

  subtractTrip(step = -1){
    if(this.trip.amount > 0){
      this.trip.amount -= 1;
    }
  }

  nextSlide(){
    this.currSlide = (this.currSlide + 1)%this.trip.imgLink.length; 
  }

  prevSlide(){
    this.currSlide = this.currSlide > 0 ? this.currSlide - 1 : this.trip.imgLink.length-1;
  }

  passTripId(){
    return Number(this.tripId);
  }

}

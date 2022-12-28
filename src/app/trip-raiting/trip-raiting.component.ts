import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { Review, TripsService } from '../trips.service';

@Component({
  selector: 'app-trip-raiting',
  templateUrl: './trip-raiting.component.html',
  styleUrls: ['./trip-raiting.component.css']
})
export class TripRaitingComponent implements OnInit {

  @Input("reviews") revievs:Review[] = []
  @Input("tripId") tripId:number = 1;

  @Input("showTotal") showTotal:boolean = false;

  tempCurrUser:string = "admin";

  public raiting:number = 0;
  constructor() {}

  ngOnInit(): void {
    this.calculateRating();
  }

  ngOnChanges(changes: SimpleChanges) {
    this.calculateRating();
  }

  calculateRating(){
    let revievslen = this.revievs.length;
    if (revievslen == 0) return
    let sum = 0;

    this.revievs.forEach(review => {
      sum += review.raiting
      if(review.raiting == 0){
        revievslen -= 1;
      }
    });

    if(revievslen == 0){
      return 
    }
    this.raiting = Math.round(sum/revievslen);
  }

}



import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CartService } from '../cart.service';
import { firestoreSnapshotData, tripHistory } from '../interfaces';
import { TripsService } from '../trips.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: tripHistory[] = [];
  status: string = ""

  constructor(private _cartService: CartService, private _tripService: TripsService) {
    try{
      this._cartService.getHistory().subscribe(res =>{
        this.history = []
        for(let i = 0; i < res.length; ++i){
          this.history.push({...res[i], startDate:"", endDate:"", name:""})

          this._tripService.getTrip(Number(res[i].tripId)).subscribe(
            data => {
              let temp = data.map( (trip: firestoreSnapshotData) => ({
              ...trip.payload.doc.data(),
              key:trip.payload.doc.id, 
              "amount":0, 
              "reviews":[]})
              )[0]
              let currHist = this.history.filter(hist => hist.tripId == temp.id)
              if(currHist.length > 0){
                currHist.forEach(hist => {
                  hist.startDate = temp.startDate;
                  hist.endDate = temp.endDate;
                  hist.name = temp.name;
                })
              }
            }
          )
        }
      },
      err => console.log('HTTP Error', err)) 
    }catch(e){
      if(e instanceof Error){
        alert(e.message)
      }else{
        alert("Unknown error occured. Try again later.")
      }
    }

  }

  ngOnInit(): void {
  }

  getStatus(endDate: string, startDate: string){
    if(new Date(endDate) < new Date()) return "finished"
    if(new Date(startDate) > new Date()) return "coming up"
    return "active"
  }

  setStatus(newStaus: string){
    if(this.status == newStaus){
      this.status = "";
    }else{
      this.status = newStaus;
    }
  }

}



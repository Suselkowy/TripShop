import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { CartService } from '../cart.service';
import { firestoreSnapshotData, tripHistory } from '../interfaces';
import { tripInfoHistory, TripsService } from '../trips.service';




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
      this._cartService.getHistory().subscribe(history =>{
        this.history = []
        for(let i = 0; i < history.length; ++i){
          this.history.push({...history[i], startDate:"", endDate:"", name:""})

          this._tripService.getTrip(Number(history[i].tripId)).subscribe(
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
        console.log(this.history);
      }) 
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

@Pipe({ name: 'historyPipe'})
export class HistoryPipe implements PipeTransform {
  getStatus(endDate: string, startDate: string){
    if(new Date(endDate) < new Date()) return "finished"
    if(new Date(startDate) > new Date()) return "coming up"
    return "active"
  }

  transform(trips: tripHistory[], status:string): tripHistory[] {
    if (!trips)
    {
      return [];
    }
    if(status == ""){
      return trips;
    }
    if (status == "finished"){
      return trips.filter(trip => this.getStatus(trip.startDate, trip.endDate) == "finished");
    }
    if(status == "active"){
      return trips.filter(trip => this.getStatus(trip.startDate, trip.endDate) == "active");
    }
    
    return trips.filter(trip => this.getStatus(trip.startDate, trip.endDate) == "coming up");
  }
}

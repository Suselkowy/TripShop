import { Component, OnInit, Pipe, PipeTransform } from '@angular/core';
import { CartService } from '../cart.service';
import { tripInfoHistory } from '../trips.service';

@Component({
  selector: 'app-history',
  templateUrl: './history.component.html',
  styleUrls: ['./history.component.css']
})
export class HistoryComponent implements OnInit {

  history: tripInfoHistory[] = [];
  status: string = ""

  constructor(private _cartService: CartService) {
    try{
      this._cartService.getHistory().subscribe(history =>{
        this.history = history
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

  transform(trips: tripInfoHistory[], status:string): tripInfoHistory[] {
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

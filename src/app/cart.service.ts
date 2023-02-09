import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable, throwError } from 'rxjs';
import { AuthService } from './auth.service';
import { tripHistoryDatabase } from './interfaces';
import { tripInfo, tripInfoHistory, TripsService } from './trips.service';



@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: tripInfo[] = [];
  private history: BehaviorSubject<tripHistoryDatabase[]>;

  currUserKey: string = ""; 

  private sumOfQuantity: BehaviorSubject<number>;


  constructor(private authService:AuthService, private firestore: AngularFirestore) {
    this.sumOfQuantity = new BehaviorSubject<number>(0);
    this.history = new BehaviorSubject<tripHistoryDatabase[]>([]);
    try{
      this.authService.currUserId.subscribe(
        {next: res =>{
        this.currUserKey = res.id;
        if(this.currUserKey == ""){
          try{
            throw Error("User not found")
          }catch{
            console.log("jajcujesz")
          }

        }
        let tempHist = this.firestore.collection<tripHistoryDatabase>("History",  ref => ref.where('user', "==", this.currUserKey)).valueChanges()
        tempHist.subscribe({
          next: 
          hist => {
          if(this.currUserKey == "" || this.currUserKey == undefined){
            //throw Error("User not found")
          }
          this.history.next(hist)
        },
          error: e => console.log("nie masno fest")
        })},
        error: err => console.log("wtf")
      }
      )
    }catch(e){
      if(e instanceof Error){
        if(e instanceof Error){
          console.log(e.message);
        }else{
          console.log("Error occured");
        }
        throw e;
      }
    }
   }

  addToCart(product: tripInfo) {
    let present: tripInfo[] = this.items.filter(item => item.id == product.id);
    if(present.length > 0){
      if(product.amount == 0){
        this.items.splice(this.items.indexOf(present[0]),1)
      }else{
        present[0].amount = product.amount
      }
    }else{
      if(product.amount > 0){
        this.items.push(product);
      }
    }

    this.sumOfQuantity.next(this.items.reduce((acc, tripElement: tripInfo) => (tripElement.amount) + acc, 0))

  }

  deleteFromCart(product: tripInfo){
    product.amount = 0;
    this.addToCart(product);
  }

  getItems() {
    return this.items;
  }

  clearCart() {
    this.items = [];
    return this.items;
  }

  tripInfoFactory(product:tripInfo){
    return function tripInfoCartEquals(obj2:tripInfo){
      return Object.entries(product).every(([k, v]) => k === "amount" || v === obj2[k as keyof tripInfo]);
    }
  }


  getAmountOfItem(id:number){
    let possibleProducts = this.items.filter(product => product.id == id);
    return (possibleProducts.length > 0) ? possibleProducts[0].amount : 0; 
  }

  getSumOfQuantity():number{
    return this.items.reduce((acc, tripElement: tripInfo) => (tripElement.amount) + acc, 0);
  }

  getSumOfQuantity2():Observable<number>{
    return this.sumOfQuantity.asObservable()
  }

  buyTrip(trip: tripInfo){
    let now = new Date();

    let boughtTrip = {
      tripId: trip.id,
      amount: trip.amount,
      buyPrice: trip.price,
      buyDate:`${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`, 
      user:this.authService.userAuthData.uid}

    this.firestore.collection("History").add(boughtTrip);
    this.deleteFromCart(trip);

  }

  getHistory(){
    try{
      if(this.currUserKey == ""){
        throw Error("User not found")
      }
      return this.history.asObservable();
    }catch(e){
      if(e instanceof Error){
        console.log(e.message);
      }else{
        console.log("Error occured");
      }
      throw e;
    }
  }

  UserBoughtTrip(tripId:number){
    return this.history.getValue().filter(position => position.user === this.authService.userAuthData.uid && position.tripId == tripId).length <= 0
  }
}



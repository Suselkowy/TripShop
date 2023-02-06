import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { tripInfo, tripInfoHistory, TripsService } from './trips.service';



@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: tripInfo[] = [];
  private history: BehaviorSubject<tripInfoHistory[]>;

  currUserKey: string = ""; 

  private sumOfQuantity: BehaviorSubject<number>;


  constructor(private authService:AuthService, private firestore: AngularFirestore) {
    this.sumOfQuantity = new BehaviorSubject<number>(0);
    this.history = new BehaviorSubject<tripInfoHistory[]>([]);
    try{
      this.authService.currUserId.subscribe(res =>{
        this.currUserKey = res.id;
        if(this.currUserKey == ""){
          throw Error("User not found")
        }

        let tempHist = this.firestore.collection<tripInfoHistory>("History",  ref => ref.where('user', "==", this.currUserKey)).valueChanges()
        tempHist.subscribe(hist => this.history.next(hist))
      })
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

    let newTrip = {...trip, buyDate:`${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`, user:this.authService.userAuthData.uid}

    this.firestore.collection("History").add(newTrip);

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
    return this.history.getValue().filter(position => position.user === this.authService.userAuthData.uid && position.id == tripId).length <= 0
  }
}



import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { tripInfo, tripInfoHistory } from './trips.service';



@Injectable({
  providedIn: 'root'
})
export class CartService {
  items: tripInfo[] = [];

  history: tripInfoHistory[] = []
  constructor(private authService:AuthService) { }

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

  }

  deleteFromCart(product: tripInfo){
    let present: tripInfo[] = this.items.filter(item => item.id == product.id);
    this.items.splice(this.items.indexOf(present[0]),1)
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

  buyTrip(trip: tripInfo){
    this.deleteFromCart(trip);

    let now = new Date();

    let newTrip = {...trip, buyDate:`${now.getDate()}-${now.getMonth()+1}-${now.getFullYear()}`, user:this.authService.userAuthData.uid}
    this.history.push(newTrip);
  }

  getHistory(){
    return this.history;
  }
}



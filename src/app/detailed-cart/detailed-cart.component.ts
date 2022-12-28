import { Component, OnInit } from '@angular/core';
import { CartService } from '../cart.service';
import { tripInfo } from '../trips.service';

@Component({
  selector: 'app-detailed-cart',
  templateUrl: './detailed-cart.component.html',
  styleUrls: ['./detailed-cart.component.css']
})
export class DetailedCartComponent implements OnInit {
  
  items: tripInfo[] = this._cartService.getItems();

  constructor(private _cartService: CartService) { }

  ngOnInit(): void {
  }

  buyTrip(trip: tripInfo){
    this._cartService.buyTrip(trip);  
  } 

}

import { Component, OnInit } from '@angular/core';
import { CartService} from '../cart.service';
import { tripInfo } from '../trips.service';

@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent implements OnInit {

  items: tripInfo[] = this.cartService.getItems();

  constructor(private cartService: CartService) { }

  ngOnInit(): void {
  }

  sumOrder():number{
    return this.items.reduce((acc, tripElement: tripInfo) => (tripElement.amount * tripElement.price) + acc, 0);
  }


  countOrder():number{
    return this.items.reduce((acc, tripElement: tripInfo) => (tripElement.amount) + acc, 0);
  }

}

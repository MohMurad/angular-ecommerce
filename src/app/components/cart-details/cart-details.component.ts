import { Component, OnInit } from '@angular/core';
import { CartItem } from 'src/app/common/cart-item';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-cart-details',
  templateUrl: './cart-details.component.html',
  styleUrls: ['./cart-details.component.css']
})
export class CartDetailsComponent implements OnInit {

  cartItems:CartItem[]=[];

  totalPrice:number=0;
  totalQuantity:number=0.0;

  constructor( private cartSevice:CartService) { }

  ngOnInit(): void {
    this.listCartDetails();
  }
  listCartDetails() {

    this.cartItems=this.cartSevice.cartItems;

    this.cartSevice.totalPrice.subscribe(
      data=>{
        this.totalPrice=data;
      }
    )

    this.cartSevice.totalQuantity.subscribe(
      data=>this.totalQuantity=data
      
    )
      this.cartSevice.computeCartTotals();

  }

  incrementQuentity(theItem:CartItem){
    this.cartSevice.addToCart(theItem);
  }
  decreseQuentity(theItem:CartItem){
    this.cartSevice.decrementQuantity(theItem);
  }

  removeItem(theItem:CartItem){
    this.cartSevice.remove(theItem);
  }
}

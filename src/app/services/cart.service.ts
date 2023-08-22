import { Injectable } from '@angular/core';
import { CartItem } from '../common/cart-item';
import { BehaviorSubject, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class CartService {

  cartItems: CartItem[] = [];

  //this refere to sessionStorage in browser.
  storage:Storage=sessionStorage;

  totalPrice: Subject<number> = new BehaviorSubject<number>(0);
  totalQuantity: Subject<number> = new BehaviorSubject<number>(0);

  constructor() {
      //read the data from storage 
      //JSON.parse() reads json string and converts it to object
      let data=JSON.parse(this.storage.getItem('cartItems')!);

      if(data!=null){
        this.cartItems=data;

        //the compute totals price and quantity based on the data that is read from storage 
        this.computeCartTotals();
      }

  }

  presistCartItems(){
    //using JSON.stringify to convert the object to jsonstring to can the storage read it 
    this.storage.setItem('cartItems',JSON.stringify(this.cartItems))
  }

  addToCart(theCartItem: CartItem) {
    //check if we already have the item in the cart
    let alreadyExistsInCart: boolean = false;
    let existingCartItem: CartItem | undefined = undefined;

    if (this.cartItems.length > 0) {

      //find the item in the cart based on the item`s id 
      // for(let tempCartItem of this.cartItems ){
      //   if(tempCartItem.id===theCartItem.id){
      //     existingCartItem=tempCartItem;
      //     break;
      //   }
      // }

      existingCartItem = this.cartItems.find(tempCartItem => tempCartItem.id === theCartItem.id);


      //check if we found it
      alreadyExistsInCart = existingCartItem !== undefined;
    }
    if (alreadyExistsInCart) {
      //increment the quantity
      existingCartItem!.quantity++;
    }
    else {
      this.cartItems.push(theCartItem);
    }

    //compute cart  totla price and total quentity
    this.computeCartTotals();
  }
  computeCartTotals() {
    let totalQuentityValue: number = 0;
    let totalPrice: number = 0.0;

    for (let currentItem of this.cartItems) {
      totalPrice += currentItem.quantity * currentItem.unitPrice;
      totalQuentityValue += currentItem.quantity;
    }
    //publish the new values 
    this.totalPrice.next(totalPrice);
    this.totalQuantity.next(totalQuentityValue);

    //presest cart data 
    this.presistCartItems();
  }


  decrementQuantity(theCartItem: CartItem) {

    theCartItem.quantity--;

    if (theCartItem.quantity === 0) {
      this.remove(theCartItem);
    }
    else {
      this.computeCartTotals();
    }
  }

  remove(theCartItem: CartItem) {

    // get index of item in the array
    const itemIndex = this.cartItems.findIndex( tempCartItem => tempCartItem.id === theCartItem.id );

    // if found, remove the item from the array at the given index
    if (itemIndex > -1) {
      this.cartItems.splice(itemIndex, 1);

      this.computeCartTotals();
    }
  }
}

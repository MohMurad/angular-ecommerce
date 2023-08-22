import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Country } from 'src/app/common/country';
import { Order } from 'src/app/common/order';
import { OrderItem } from 'src/app/common/order-item';
import { Purchase } from 'src/app/common/purchase';
import { State } from 'src/app/common/state';
import { CartService } from 'src/app/services/cart.service';
import { CheckoutHandlingService } from 'src/app/services/checkout-handling.service';
import { CheckoutSendToDbService } from 'src/app/services/checkout-send-to-db.service';
import { CustomValidator } from 'src/app/validators/custom-validator';

@Component({
  selector: 'app-chekout',
  templateUrl: './chekout.component.html',
  styleUrls: ['./chekout.component.css']
})
export class ChekoutComponent implements OnInit {

  totalPrice: number = 0;
  totalQuantity: number = 0.0;
  checkoutFormGroup!: FormGroup;

  creditCardYears: number[] = [];
  creditCardMonth: number[] = [];
  countires: Country[] = [];
  shippingAdressStates: State[] = [];
  billingAdressStates: State[] = [];

  constructor(private formBuilder: FormBuilder,
    private checkoutHandling: CheckoutHandlingService,
    private cartService:CartService,
    private checkoutSendToDbService:CheckoutSendToDbService,
    private router:Router) { }

  ngOnInit(): void {

    this.reviewCartDetails();

    this.checkoutFormGroup = this.formBuilder.group({
      customer: this.formBuilder.group({
        firstName:new FormControl('',
        [Validators.required,
          Validators.minLength(2),
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),

        lastName:new FormControl('',
        [Validators.required,
         Validators.minLength(2),
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),

        email:new FormControl('',
        [Validators.required,
          Validators.pattern(`^[a-zA-Z0-9._%+-]+@gmail\.com$`),
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),
      }),
      
      shippingAddress: this.formBuilder.group({
        country:new FormControl('',
        [Validators.required]) ,

        street: new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),
          
        city:new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),

        state:new FormControl('',
        [Validators.required]),

        zipCode:new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),
      }),

      billingAdress: this.formBuilder.group({
        country:new FormControl('',
        [Validators.required]) ,

        street: new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),
          
        city:new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),

        state:new FormControl('',
        [Validators.required]),

        zipCode:new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),
      }),

      creditCard: this.formBuilder.group({
        cardType: new FormControl('',
        [Validators.required]),

        numberOnCard: new FormControl('',
        [Validators.required,CustomValidator.notOnlyWhitespace.bind(CustomValidator)]),

        cardNumber: new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator),
          Validators.pattern('[0-9]{16}')]),

        securityCode:new FormControl('',
        [Validators.required,
          CustomValidator.notOnlyWhitespace.bind(CustomValidator),
          Validators.pattern('[0-9]{3}')]),

        expirarationMonth:[''],
        expirarationYear: [''],
      }),
    })

    const startMonth: number = new Date().getMonth() + 1;
    this.checkoutHandling.getCreditCardMonth(startMonth).subscribe(
      data => {
        this.creditCardMonth = data;
        console.log("test Month" + this.creditCardMonth);
      }
    )

    this.checkoutHandling.getCreditCardYear().subscribe(
      data => {
        this.creditCardYears = data;
        console.log("test Year" + this.creditCardYears);
      }
    )

    this.checkoutHandling.getCountries().subscribe(
      data => {
        this.countires = data;
      }
    )
  }
  reviewCartDetails() {
      this.cartService.totalPrice.subscribe(data=>this.totalPrice=data);
      this.cartService.totalQuantity.subscribe(data=>this.totalQuantity=data)
  }
  get firstName(){ return this.checkoutFormGroup.get('customer.firstName'); }
  get lastName(){return this.checkoutFormGroup.get('customer.lastName');}
  get email(){ return this.checkoutFormGroup.get('customer.email'); }

  get shippingAddressCountry(){ return this.checkoutFormGroup.get('shippingAddress.country'); }
  get shippingAddressStreet(){ return this.checkoutFormGroup.get('shippingAddress.street'); }
  get shippingAddressCity(){ return this.checkoutFormGroup.get('shippingAddress.city'); }
  get shippingAddressState(){ return this.checkoutFormGroup.get('shippingAddress.state'); }
  get shippingAddressZipCode(){ return this.checkoutFormGroup.get('shippingAddress.zipCode'); }

  get billingAdressCountry(){ return this.checkoutFormGroup.get('billingAdress.country'); }
  get billingAdressStreet(){ return this.checkoutFormGroup.get('billingAdress.street'); }
  get billingAdressCity(){ return this.checkoutFormGroup.get('billingAdress.city'); }
  get billingAdressState(){ return this.checkoutFormGroup.get('billingAdress.state'); }
  get billingAdressZipCode(){ return this.checkoutFormGroup.get('billingAdress.zipCode'); }


  get creditCardCardType(){ return this.checkoutFormGroup.get('creditCard.cardType'); }
  get creditCardNamberOnCard(){ return this.checkoutFormGroup.get('creditCard.numberOnCard'); }
  get creditCardCardNumber(){ return this.checkoutFormGroup.get('creditCard.cardNumber'); }
  get creditCardSecurityCode(){ return this.checkoutFormGroup.get('creditCard.securityCode'); }
  get creditCardExpirarationMonth(){ return this.checkoutFormGroup.get('creditCard.expirarationMonth'); }
  get creditCardExpirarationYear(){ return this.checkoutFormGroup.get('creditCard.expirarationYear'); }

  copyShippingAdressToBillingAdress(event: any) {
    if (event.target.checked) {
      this.checkoutFormGroup.controls['billingAdress'].setValue(this.checkoutFormGroup.controls['shippingAddress'].value);
      this.billingAdressStates = this.shippingAdressStates
    }
    else {
      this.checkoutFormGroup.controls['billingAdress'].reset();
      this.billingAdressStates = [];
    }
  }

  onSubmit() {
    // console.log(this.checkoutFormGroup.get('customer')?.value);
    // console.log(this.checkoutFormGroup.get('customer')?.value.firstName);
    if(this.checkoutFormGroup.invalid){
      this.checkoutFormGroup.markAllAsTouched();
      return;
    }

    // set up order
    let order = new Order();
    order.totalPrice = this.totalPrice;
    order.totalQuantity = this.totalQuantity;

    // get cart items
    const cartItems = this.cartService.cartItems;

    // create orderItems from cartItems
    // - long way
    /*
    let orderItems: OrderItem[] = [];
    for (let i=0; i < cartItems.length; i++) {
      orderItems[i] = new OrderItem(cartItems[i]);
    }
    */

    // - short way of doing the same thingy
    let orderItems: OrderItem[] = cartItems.map(tempCartItem => new OrderItem(tempCartItem));

    // set up purchase
    let purchase = new Purchase();
    
    // populate purchase - customer
    purchase.customer = this.checkoutFormGroup.controls['customer'].value;
    
    // populate purchase - shipping address
    purchase.shippingAddress = this.checkoutFormGroup.controls['shippingAddress'].value;
    const shippingState: State = JSON.parse(JSON.stringify(purchase.shippingAddress.state));
    const shippingCountry: Country = JSON.parse(JSON.stringify(purchase.shippingAddress.country));
    purchase.shippingAddress.state = shippingState.name;
    purchase.shippingAddress.country = shippingCountry.name;

    // populate purchase - billing address
    purchase.billingAddress = this.checkoutFormGroup.controls['billingAdress'].value;
    const billingState: State = JSON.parse(JSON.stringify(purchase.billingAddress.state));
    const billingCountry: Country = JSON.parse(JSON.stringify(purchase.billingAddress.country));
    purchase.billingAddress.state = billingState.name;
    purchase.billingAddress.country = billingCountry.name;
  
    // populate purchase - order and orderItems
    purchase.order = order;
    purchase.orderItems = orderItems;

    console.log("the purchase is :"+JSON.stringify(purchase));
    // call REST API via the CheckoutService
    this.checkoutSendToDbService.placeOrder(purchase).subscribe({
        next: response => {
          alert(`Your order has been received.\nOrder tracking number: ${response.orderTrackingNumber}`);

          // reset cart
          this.resetCart();

        },
        error: err => {
          alert(`There was an error: ${err.message}`);
        }
      }
    );






  }
  resetCart() {
    
    //reset the cart data 
    this.cartService.cartItems=[];
    this.cartService.totalPrice.next(0);
    this.cartService.totalQuantity.next(0);

    //reset the form 
    this.checkoutFormGroup.reset();

    //navigate to the product page
    this.router.navigateByUrl('/products');
  }

  handleMonthAndYear() {

    const creditCardFormGroup = this.checkoutFormGroup.get('creditCard')

    const currentYear: number = new Date().getFullYear();

    const selectedYear: number = Number(creditCardFormGroup?.value.expirarationYear);

    let startMonth: number;

    if (currentYear === selectedYear) {
      startMonth = new Date().getMonth() + 1;
    }
    else {
      startMonth = 1;
    }

    this.checkoutHandling.getCreditCardMonth(startMonth).subscribe(
      data => {
        this.creditCardMonth = data;
        console.log("months:" + this.creditCardMonth)

        //this line to select first item by default
        this.checkoutFormGroup.get('creditCard')?.get('expirarationMonth')?.setValue(data[0])
      }
    )

  }

  getStates(formGroupName: string) {

    const formGroup = this.checkoutFormGroup.get(formGroupName);
    const countryCode = formGroup?.value.country.code;
    this.checkoutHandling.getStates(countryCode).subscribe(
      data => {
        if (formGroupName === 'shippingAddress') {
          this.shippingAdressStates = data;
        }
        else {
          this.billingAdressStates = data;
        }
        //this line to select first item by default
        formGroup?.get('state')?.setValue(data[0]);
      }

    );
  }

}

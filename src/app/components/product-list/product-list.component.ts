import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { CartItem } from 'src/app/common/cart-item';
import { Product } from 'src/app/common/product';
import { CartService } from 'src/app/services/cart.service';
import { ProductService } from 'src/app/services/product.service';

@Component({
  selector: 'app-product-list',
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.css']
})
export class ProductListComponent implements OnInit {

  products: Product[] = [];
  currentCategoryId: number = 1;
  previousCategoryId: number = 1;
  currentCategoryName: string = "";
  searchMode: boolean = false;


  //properites for pagenation
  thePageNumber: number = 1;
  thePageSize: number = 5;
  theTotalElements: number = 0;
  previousKeyword: string = "";


  constructor(
    private productService: ProductService,
    private route: ActivatedRoute,
    private cartService:CartService
  ) { }

  ngOnInit(): void {
    this.route.paramMap.subscribe(() => {
      this.listProducts()
    });
  }
  listProducts() {
    this.searchMode = this.route.snapshot.paramMap.has('keyword');
    if (this.searchMode) {
      this.handleSearchProduct();
    }
    else {
      this.handleListProduct();
    }
  }

  handleSearchProduct() {
    const theKeyword = this.route.snapshot.paramMap.get('keyword')!;

    if (this.previousKeyword !== theKeyword) {
      this.thePageNumber = 1;
    }
    this.previousKeyword = theKeyword;


    this.productService.searchProductPaginate(
      theKeyword,
      this.thePageNumber - 1,
      this.thePageSize,
    ).subscribe(this.processResult());
  }

  handleListProduct() {

    //check if  "id" is available 
    //route using the activatedRoute
    //snapshot is using to know the status of the route at this given moment
    //paramMap is used to map of all route parameters

    const hasCategoryId: boolean = this.route.snapshot.paramMap.has("id");


    if (hasCategoryId) {
      // get the "id" param string. convert string to a number using the "+" symbol
      this.currentCategoryId = +this.route.snapshot.paramMap.get('id')!;

      // get the "name" param string
      this.currentCategoryName = this.route.snapshot.paramMap.get('name')!;
    }
    else {
      // not category id available ... default to category id 1
      this.currentCategoryId = 1;
      this.currentCategoryName = 'Books';
    }

    if (this.previousCategoryId != this.currentCategoryId) {
      this.thePageNumber = 1;
    }

    this.previousCategoryId = this.currentCategoryId;

    console.log(`currentCategoryId=${this.currentCategoryId}, thePageNumber=${this.thePageNumber}`);

    // now get the products for the given category id
    this.productService.getProductListPaginate(
      this.currentCategoryId,
      this.thePageNumber - 1,
      this.thePageSize,
    )
      .subscribe(this.processResult());

  }

  updatePageSize(pageSize: string) {
    this.thePageSize = +pageSize;
    this.thePageNumber = 1;
    this.listProducts();
  }

  processResult() {
    return (data: any) => {
      this.products = data._embedded.products;
      this.thePageNumber = data.page.number + 1;
      this.thePageSize = data.page.size;
      this.theTotalElements = data.page.totalElements;
    }
  }
  addToCard(theProduct:Product){
    console.log("theName"+theProduct.name);
    const theCartItem=new CartItem(theProduct);
    this.cartService.addToCart(theCartItem);
  }

}

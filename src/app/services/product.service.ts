import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { Product } from '../common/product';
import { ProductCategory } from '../common/product-category';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  private baseUrl = environment.ecommerceUrl+'/products';

  private categoryUrl =environment.ecommerceUrl+'/product-category';

  constructor(private httpClient: HttpClient) { }


  getProductListPaginate(
    theCategoryId: number,
    thePage: number,
    thePageSize: number): Observable<GetResponseProduct> {

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`
      + `&page=${thePage}&size=${thePageSize}`;
    console.log(`the searchurl=${searchUrl}`);
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }

  //Observable maps the JSON data from spring data rest to Product array
  getProductList(theCategoryId: number): Observable<Product[]> {

    //@TODO: need to build URL based on the category id 

    const searchUrl = `${this.baseUrl}/search/findByCategoryId?id=${theCategoryId}`

    return this.getProducts(searchUrl);
  }

  searchProducts(theKeyword: string): Observable<Product[]> {
    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
    return this.getProducts(searchUrl)
  }

 searchProductPaginate(
   theKeyword:string,
    thePage: number,
    thePageSize: number): Observable<GetResponseProduct> {

    const searchUrl = `${this.baseUrl}/search/findByNameContaining?name=${theKeyword}`
      + `&page=${thePage}&size=${thePageSize}`;
    console.log(`the searchurl=${searchUrl}`);
    return this.httpClient.get<GetResponseProduct>(searchUrl);
  }




  private getProducts(searchUrl: string): Observable<Product[]> {
    return this.httpClient.get<GetResponseProduct>(searchUrl).pipe(
      map(response => response._embedded.products)
    );
  }

  //Observable maps the JSON data from spring data rest to productCategory array
  getProductCategories(): Observable<ProductCategory[]> {
    return this.httpClient.get<GetResponseProductCategory>(this.categoryUrl).pipe(
      map(response => response._embedded.productCategory)
    );
  }


  getProduct(currentCategoryId: number): Observable<Product> {
    const productUrl = `${this.baseUrl}/${currentCategoryId}`
    return this.httpClient.get<Product>(productUrl);
  }

}




interface GetResponseProduct {
  _embedded: {
    products: Product[];
  },
  page: {
    size: number,
    totalElements: number,
    totalPages: number,
    number: number
  }

}

interface GetResponseProductCategory {
  _embedded: {
    productCategory: ProductCategory[];
  }
}
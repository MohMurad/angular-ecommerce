import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, map, of } from 'rxjs';
import { Country } from '../common/country';
import { State } from '../common/state';


@Injectable({
  providedIn: 'root'
})
export class CheckoutHandlingService {

 private countryUrl:string="http://localhost:8080/api/countries";
 private stateUrl:string="http://localhost:8080/api/states";

  constructor(private httpClient:HttpClient) { }


  getCountries():Observable<Country[]>{
    return this.httpClient.get<GetRsponseCountries>(this.countryUrl).pipe(
      map(response=>response._embedded.countries)
    )
  }

  getStates(code:string):Observable<State[]>{
   const statesUrl=`${this.stateUrl}/search/findByCountryCode?code=${code}`
    return this.httpClient.get<GetResponseStates>(statesUrl).pipe(
      map(response=>response._embedded.states)
    )
  }

  getCreditCardMonth(startMonth:number):Observable<number[]>{
    let data:number[]=[];
    for(let theMonth=startMonth;theMonth<=12;theMonth++){
        data.push(theMonth);
    }
    //of operation will wrap an object to an observable
    return of(data);
  }
  getCreditCardYear():Observable<number[]>{
    let data:number[]=[];

    //this to get the current Year
    const startYear:number=new Date().getFullYear();
    const endYear:number=startYear+10;

    for(let theYear=startYear;theYear<=endYear;theYear++){
      data.push(theYear);
    }

    return of(data);
  }

}

interface GetRsponseCountries{
  _embedded:{
    countries:Country[],
  }
}

interface GetResponseStates{
  _embedded:{
    states:State[],
  }
}
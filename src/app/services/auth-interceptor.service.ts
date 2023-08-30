import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Inject, Injectable } from '@angular/core';
import { OKTA_AUTH } from '@okta/okta-angular';
import { OktaAuth } from '@okta/okta-auth-js';
import { Observable, from, lastValueFrom } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthInterceptorService implements HttpInterceptor{

  constructor(@Inject(OKTA_AUTH) private oktaAuth:OktaAuth) { }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
      return from(this.hadleAcess(request,next))
  }
 private async hadleAcess(request:HttpRequest<any>,next:HttpHandler):Promise<HttpEvent<any>>{

      //only add an access token for secured endpoints
      const securedEndpoints=[environment.ecommerceUrl+'/orders'];
     // const securedEndpoints=['http://localhost:8080/api/orders']

      if(securedEndpoints.some(url=>request.urlWithParams.includes(url))){

        //get access token
        const accessToken=this.oktaAuth.getAccessToken();

        //clone the request and add new header with access token
        //we using clone becouse we need make changes on the copy of the request  not in the original request

        request=request.clone({
          setHeaders:{
            Authorization: 'Bearer ' + accessToken
          }
        });
      }
      return await lastValueFrom(next.handle(request));
  }
}

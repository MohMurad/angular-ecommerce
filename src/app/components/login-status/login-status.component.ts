import { Component, Inject, OnInit } from '@angular/core';
import{OKTA_AUTH, OktaAuthStateService}from'@okta/okta-angular';
import{OktaAuth}from'@okta/okta-auth-js';

@Component({
  selector: 'app-login-status',
  templateUrl: './login-status.component.html',
  styleUrls: ['./login-status.component.css']
})
export class LoginStatusComponent implements OnInit {

  
  isAuthenticated: boolean = false;
  userFullName: string = '';

  storage:Storage=sessionStorage;

  constructor(private oktaAuthService: OktaAuthStateService,
    @Inject(OKTA_AUTH) private oktaAuth: OktaAuth) { }

  ngOnInit(): void {

    // Subscribe to authentication state changes
    this.oktaAuthService.authState$.subscribe(
      (result) => {
        console.log("result:"+result);
        this.isAuthenticated = result.isAuthenticated!;
        this.getUserDetails();
      }
    );
  }
  
  getUserDetails() {
    if (this.isAuthenticated) {

      // Fetch the logged in user details (user's claims)
      //
      // user full name is exposed as a property name
      this.oktaAuth.getUser().then(
        (res) => {
          this.userFullName = res.name as string;

          //get the user email if the user is authanticated
          const theEmail=res.email;
          //and store this email to session to can any page in the app can access it
          this.storage.setItem('userEmail',JSON.stringify(theEmail));

        }
      );
    }
  }

  logout() {
    // Terminates the session with Okta and removes current tokens.
    this.oktaAuth.signOut();
  }

}

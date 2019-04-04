import {Component, OnInit} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {environment} from '../environments/environment';
import {Router, ActivationStart} from "@angular/router";
import {Location} from "@angular/common";
import {HostListener} from "@angular/core";
import {MatSnackBar} from "@angular/material";
import {AppService} from "./app.service";


declare var gapi: any;

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  providers: [AppService]
})

export class AppComponent implements OnInit {
  googleAuth;
  public currentPath;
  public currentWidth;
  public currentId;
  public username: string;

  constructor(private http: HttpClient,
              private router: Router,
              private _location: Location,
  public appService: AppService

)
               {

    this.router.events.subscribe((e) => {
      if (e instanceof ActivationStart) {
        this.currentPath = e.snapshot.routeConfig.path;
        this.currentId = e.snapshot.params['_id'];
      }
    })

    this.onResize();
  }


  @HostListener('window:resize', ['$event'])
  onResize(event?) {
    this.currentWidth = window.innerWidth;
  }

  backClicked() {
    this._location.back();

  }

  // Checks if the user is on journal mobile view or desktop view
  // And sets according add, delete buttons in the navbar


  // Checks if the user is on goal mobile view or desktop view
  // And sets according add, delete buttons in the navbar
  isGoalView(): boolean {
    if (this.currentPath == 'goals/:_id' && this.currentWidth < 600) {
      return true;
    } else {
      return false;
    }
  }

  // This requests and gets the name from local storage
  getUsername() {
    this.username = localStorage.getItem("userFirstName") + " " + localStorage.getItem("userLastName");
    if (this.username.length > 18) {
      this.username = this.username.slice(0, 17) + "...";
    }
  }

  // This signs in the user and opens the window for signing in
  signIn() {
    this.googleAuth = gapi.auth2.getAuthInstance();
    console.log(this.googleAuth);
    this.googleAuth.grantOfflineAccess().then((resp) => {
      localStorage.setItem('isSignedIn', 'true');
      this.sendAuthCode(resp.code);
    });
  }



  // This signs the user out
  signOut() {
    this.handleClientLoad();

    this.googleAuth = gapi.auth2.getAuthInstance();

    this.googleAuth.then(() => {
      this.googleAuth.signOut();
      localStorage.setItem('isSignedIn', 'false');
      window.location.reload();
    })
  }

  // This sends the auth code of our user to the server and stores the fields in local storage when we get data back
  // from gapi
  sendAuthCode(code: string): void {
    const httpOptions = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
    };

    this.http.post(environment.API_URL + "login", {code: code}, httpOptions)
      .subscribe(onSuccess => {
        console.log("Code sent to server");
        console.log(onSuccess["_id"]);
        console.log(onSuccess["_id"]["$oid"]);
        console.log(onSuccess["FirstName"]);
        console.log(onSuccess["LastName"]);
        localStorage.setItem("userID", onSuccess["_id"]["$oid"]);
        localStorage.setItem("userFirstName", onSuccess["FirstName"]);
        localStorage.setItem("userLastName", onSuccess["LastName"]);
        localStorage.setItem("fontSelected", onSuccess["FontSetting"]);
        localStorage.setItem("styleSelected", onSuccess["StyleSetting"]);
      }, onFail => {
        console.log("ERROR: Code couldn't be sent to the server");
      });
  }

  initClient() {
    gapi.client.init({
      'clientId': '936642482862-79h00b2t5r2l7n0ld19vp6hf6887p2db.apps.googleusercontent.com',
      'scope': 'profile email'
    });
  }

  handleClientLoad() {
    gapi.load('client:auth2', this.initClient);
  }


  ngOnInit() {
    this.handleClientLoad();
    gapi.load('client:auth2', this.initClient);
    this.getUsername();
  }
}

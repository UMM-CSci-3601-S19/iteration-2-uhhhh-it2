import {Component, OnInit} from '@angular/core';
import {Ride} from './ride';
import {RideListComponent} from "./ride-list.component";
import {RideListService} from "./ride-list.service";
import {ValidatorService} from '../validator.service';
import {Observable} from "rxjs/Observable";


@Component({
  selector: 'add-ride.component',
  templateUrl: 'add-ride.component.html',
  styleUrls: ['./add-ride.component.scss'],
  providers: [ RideListComponent ],

})

export class AddRideComponent implements OnInit {

  public rides: Ride[];

  private highlightedID: string;


  public rideDriver: string;
  public rideNotes: string;
  public rideSeats: number;
  public rideOrigin: string;
  public rideDestination: string;
  public rideDepartureDate: string;
  public rideDepartureTime: string;
  public rideNonSmoking: false;


  // Please keep this as the default value, or you will have problems with form validation / seats available as a rider.
  public rideDriving: true;


  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, public validatorService: ValidatorService) {
  }

  addRide(): void {
    const newRide: Ride = {
      _id: '',
      driver: this.rideDriver,
      notes: this.rideNotes,
      seatsAvailable: this.rideSeats,
      origin: this.rideOrigin,
      destination: this.rideDestination,
      departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime,
      isDriving: this.rideDriving,
      nonSmoking: this.rideNonSmoking
    };


    if (newRide != null) {
      this.rideListService.addNewRide(newRide).subscribe(
        result => {
          this.highlightedID = result ;

        },
        err => {
          // This should probably be turned into some sort of meaningful response.
          console.log('There was an error adding the ride.');
          console.log('The newRide or dialogResult was ' + newRide);
          console.log('The error was ' + JSON.stringify(err));
        });

      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
      this.refreshRides();
    //This is the only solution to a refresh-on-addride
      // we were having that worked consistently, it's hacky but seems to work well.
    }
  };



  refreshRides(): Observable<Ride[]> {
    // Get Rides returns anhttps://stackoverflow.com/questions/47091872/angular-4-cannot-instantiate-cyclic-dependency-injectiontoken-http-interceptor?rq=1 Observable, basically a "promise" that
    // we will get the data from the server.
    //
    // Subscribe waits until the data is fully downloaded, then
    // performs an action on it (the first lambda)
    const rides: Observable<Ride[]> = this.rideListService.getRides();
    rides.subscribe(
      rides => {
        this.rides = rides;
      },
      err => {
        console.log(err);
      });
    return rides;
  }


  // IMPORTANT! This function gets called whenever the user selects 'looking for a ride'.
  //   This is so that form validator doesn't get mad for having an invalid 'rideSeats' value.
  //   Before adding the ride to the DB, the value gets set to 0 (by the ride controller).
  //   Also, ride-list component HTML won't display this number unless it is indeed a Driver.
  setRideSeats() {
    this.rideSeats = 1;
  }


  ngOnInit() {
    this.validatorService.createForm();
  }


}


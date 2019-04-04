import {Component, Input, OnInit} from '@angular/core';
import {Ride} from '../rides/ride';
import {ValidatorService} from '../validator.service';
import {Observable} from "rxjs/Observable";
import {RideListComponent} from "../rides/ride-list.component";
import {RideListService} from "../rides/ride-list.service";


@Component({
  selector: 'app-edit-ride',
  templateUrl: './edit-ride.component.html',
  styleUrls: ['./edit-ride.component.css'],
  providers: [ RideListComponent ],
})

export class EditRideComponent implements OnInit {

  public rides: Ride[];
  public reqID = this.rideListComponent.requestedID;

  public rideID: string = '';
  public ride: Ride = {
    _id: '',
    driver: '',
    notes: '',
    seatsAvailable: 0,
    origin: '',
    destination: '',
    departureDate: '',
    departureTime: '',
    isDriving: null,
    nonSmoking: null
  };

  private highlightedID: string = '';
  private returnedRide: string = '';

  public rideDriver: string;
  public rideNotes: string;
  public rideSeats: number;
  public rideOrigin: string;
  public rideDestination: string;
  public rideDepartureDate: string;
  public rideDepartureTime: string;
  public rideNonSmoking: false;

  // Please keep this as the default value, or you will have problems with form validation / seats available as a rider.
  public isDriving: true;
  constructor(public rideListService: RideListService,
              public validatorService: ValidatorService,
              public rideListComponent: RideListComponent) { }

  editRide(): void {
    const editedRide: Ride = {
      _id: this.ride._id,
      driver: this.rideDriver,
      notes: this.rideNotes,
      seatsAvailable: this.rideSeats,
      origin: this.rideOrigin,
      destination: this.rideDestination,
      departureDate: this.rideDepartureDate,
      departureTime: this.rideDepartureTime,
      isDriving: this.isDriving,
      nonSmoking: this.rideNonSmoking,
    };

    console.log("Edited ride: " + editedRide);

    if (editedRide != null) {
      this.rideListService.editExistingRide(editedRide, "5c832bec3f173391643a15f1").subscribe(
      // this.rideListService.addNewRide(editedRide).subscribe(
        result => {
          this.highlightedID = result;

        },
        err => {
          // This should probably be turned into some sort of meaningful response.
          console.log('There was an error editing the ride.');
          console.log('The editedRide or dialogResult was ' + editedRide);
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
      //This is the only solution to a refresh-on-editride
      // we were having that worked consistently, it's hacky but seems to work well.
    }
  };

  showExistingRide() {
    console.log("THIS SHOULD BE THE RIDE ID: " + this.reqID);
    this.rideListService.retrieveExistingRide("5c832bec3f173391643a15f1").subscribe(
      // result => {
      // this.returnedRide = result;
      // console.log("the result" + result);
      // },
      // err => {
      //   // This should probably be turned into some sort of meaningful response.
      //   console.log('There was an error retrieving the ride.');
      //   // console.log('The editedRide or dialogResult was ' + editedRide);
      //   console.log('The error was ' + JSON.stringify(err));
      // });
      // (data: String) => console.log(data))
      (data: Ride) => {
        console.log(data);
        this.ride._id = data._id['$oid'];
        this.ride.driver = data.driver;
        this.ride.notes = data.notes;
        this.ride.seatsAvailable = data.seatsAvailable;
        this.ride.origin = data.origin;
        this.ride.destination = data.destination;
        this.ride.departureDate = data.departureDate;
        this.ride.departureTime = data.departureTime;
        this.ride.isDriving = data.isDriving;
        this.ride.nonSmoking = data.nonSmoking;
      });

    console.log("Ride reconstructed from GET" + this.ride);

  };


  refreshRides(): Observable<Ride[]> {
    // Get Rides returns an Observable, basically a "promise" that
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
  //   Before adding the ride to the DB, the value gets set to -1 (by the ride controller).
  //   Also, ride-list component HTML won't display this number unless it is indeed a Driver.
  setRideSeats() {
    this.rideSeats = 1;
  }

  ngOnInit() {
    console.log("EXISTING RIDE:" + this.showExistingRide());
    this.validatorService.createForm();
  }

}

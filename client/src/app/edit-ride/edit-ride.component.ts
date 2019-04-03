import { Component, OnInit } from '@angular/core';
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

  public rideID: string = '';

  private highlightedID: string = '';


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
  constructor(public rideListService: RideListService, public validatorService: ValidatorService ) { }


  ngOnInit() {
    this.validatorService.createForm();
  }

}

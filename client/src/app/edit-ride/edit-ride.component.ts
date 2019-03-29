import { Component, OnInit } from '@angular/core';
import {Ride} from '../rides/ride';
import {FormControl, Validators, FormGroup, FormBuilder} from "@angular/forms";

//editing a ride should have the same validation as adding a ride
import {AddRideComponent} from "../rides/add-ride.component";

//validator.service should do the job that add-ride is currently doing
import {ValidatorService} from 'app/validator.service';

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

  constructor() { }

  ngOnInit() {
  }

}

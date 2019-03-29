import { Injectable } from '@angular/core';
import {Observable, of } from "rxjs/Observable";
import {Ride} from "./rides/ride";

//might not need, but the getRides method may be useful
import {RideListService} from "./rides/ride-list.service";


@Injectable({
  providedIn: 'root'
})
export class ValidatorService {

  constructor(private validatorService: ValidatorService) { }

  validateRide(): Observable<Ride> {

  }
}

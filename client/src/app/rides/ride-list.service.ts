import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import {Observable} from 'rxjs/Observable';

import {Ride} from './ride';
import {environment} from '../../environments/environment';

@Injectable()

export class RideListService {
  readonly baseUrl: string = environment.API_URL + 'rides';
  private rideUrl: string = this.baseUrl;

  constructor(private http: HttpClient) {
  }

  getRides(): Observable<Ride[]> {
    return this.http.get<Ride[]>(this.rideUrl);
  }

  addNewRide(newRide: Ride): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new ride back
      // so we know how to find/access that user again later.
      responseType: 'text' as 'json'
    };


    // Send post request to add a new user with the user data as the body with specified headers.

    //this.rlc.refreshRides();
    const id = this.http.post<string>(this.rideUrl + '/new', newRide, httpOptions);
    console.log("ADD (POST) ID: " + id);
    return id;
  }

  editExistingRide(existingRideEdited: Ride, idOfRide: string): Observable<string> {
    const httpOptions = {
      headers: new HttpHeaders({
        // We're sending JSON
        'Content-Type': 'application/json'
      }),
      // But we're getting a simple (text) string in response
      // The server sends the hex version of the new ride back
      // so we know how to find/access that user again later.
      responseType: 'text' as 'json'
    };

    const id = this.http.post<string>(this.rideUrl + '/' + idOfRide, existingRideEdited, httpOptions);
    console.log("EDIT (POST) ID: ");
    return id;
  }

  retrieveExistingRide(idOfRide: string): Observable<string> {

    // const id = this.http.get<string>(this.rideUrl + '/' + idOfRide, httpOptions);
    const id = this.http.get<string>(this.rideUrl + '/5c832bec3f173391643a15f1');
    console.log("RETRIEVE (GET) ID: " + id);
    return id;
  }
}

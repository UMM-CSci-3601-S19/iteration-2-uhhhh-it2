import {Component, OnInit} from '@angular/core';
import {RideListService} from './ride-list.service';
import {Ride} from './ride';
import {Observable} from 'rxjs/Observable';
import {AppService} from "../app.service";

@Component({
  selector: 'ride-list-component',
  templateUrl: 'ride-list.component.html',
  styleUrls: ['./ride-list.component.scss'],
  providers: []
})

export class RideListComponent implements OnInit {
  // public so that tests can reference them (.spec.ts)
  public rides: Ride[];
  public filteredRides: Ride[];

  // target values used in filtering
  public rideDestination: string;
  public rideOrigin: string;
  public rideDriving: boolean;
  public rideNonSmoking: boolean = false; // this defaults the box to be unchecked

  // Inject the RideListService into this component.
  constructor(public rideListService: RideListService, public appService : AppService) {
 //   rideListService.addListener(this);
  }

  // This method is used in the HTML instead of ngModel, since it solves a problem where
  // clicking on the checkbox didn't always 'uncheck' the box. Implementing this method with
  // (click)=toggleNonSmoking, and checked="rideNonSmoking", fixes that bothersome problem.
  public toggleNonSmoking() {
    this.rideNonSmoking = !this.rideNonSmoking
  }

  public checkImpossibleDate(ride: Ride) {
    return (ride.departureDate.includes("3000"))
  }

  public checkImpossibleTime(ride: Ride) {
    return (ride.departureTime.includes("99"))
  }

  public filterRides(searchDestination: string, searchOrigin: string,
                     searchIsDriving: boolean, searchNonSmoking): Ride[] {

    this.filteredRides = this.rides;

    // Filter by destination
    if (searchDestination != null) {
      searchDestination = searchDestination.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchDestination || ride.destination.toLowerCase().indexOf(searchDestination) !== -1;
      });
    }

    // Filter by origin
    if (searchOrigin != null) {
      searchOrigin = searchOrigin.toLocaleLowerCase();

      this.filteredRides = this.filteredRides.filter(ride => {
        return !searchOrigin || ride.origin.toLowerCase().indexOf(searchOrigin) !== -1;
      });
    }

    if (searchIsDriving != null) {

      this.filteredRides = this.filteredRides.filter(ride => {
        return ride.isDriving === searchIsDriving;
      });
    }

    // We only check for true, so that an unchecked box allows all rides to come through.
    if (searchNonSmoking === true) {

      this.filteredRides = this.filteredRides.filter(ride => {
        return ride.nonSmoking === searchNonSmoking;
      });
    }

    return this.filteredRides;
  }

  /**
   * Starts an asynchronous operation to update the rides list
   *
   */
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
        this.filterRides(this.rideDestination, this.rideOrigin, this.rideDriving, this.rideNonSmoking);
      },
      err => {
        console.log(err);
      });
    return rides;
  }

  loadService(): void {
    this.rideListService.getRides().subscribe(
      rides => {
        this.rides = rides;
      },
      err => {
        console.log(err);
      }
    );
  }

  ngOnInit(): void {
    this.refreshRides();
    this.loadService();
  }

  // Lifted from the server side code. Parses ISO dates for human readable month/day. For example:
  // 2019-03-26T05:00:00.000Z becomes March 26th
  public dateParse(selectedDate: string) {
    const months = ["January", "February", "March", "April", "May", "June", "July", "August",
      "September", "October", "November", "December"];
    const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dateDateFormat = new Date(selectedDate);
    const dateFullMonth = months[dateDateFormat.getMonth()];
    const dateDay = days[dateDateFormat.getDay()];
    let date = dateDateFormat.getDate().toString();
    if (date === '1' || date === '21' || date === '31') {
      date += 'st';
    } else if (date === '2' || date === '22') {
      date += 'nd';
    } else if (date === '3' || date === '23') {
      date += 'rd';
    } else {
      date += 'th';
    }

    return dateFullMonth + " " + date;
  }

  //Tushar Gupta @ https://jsfiddle.net/cse_tushar/xEuUR/
  //Converts 24 hour time to AM/PM
  public hourParse(time) {
    let hours = time[0] + time[1];
    let min = time[3] + time[4];
    if(hours == 0) {
      return '12:' + min + ' AM';
    } else if (hours == 12) {
      return '12:' + min + ' PM';
    } else if (hours < 12) {
      if(hours<10){return hours[1] + ':' + min + ' AM';} //strip off leading 0
      else{return hours + ':' + min + ' AM';}
    } else {
      hours=hours - 12;
      hours=(hours.length < 10) ? '0'+hours:hours;
      return hours+ ':' + min + ' PM';
    }
  }

}

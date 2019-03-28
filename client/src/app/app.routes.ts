// Imports
import {ModuleWithProviders} from '@angular/core';
import {Routes, RouterModule} from '@angular/router';
import {RideListComponent} from "./rides/ride-list.component";
import {AddRideComponent} from "./rides/add-ride.component";
import {AppComponent} from "./app.component";
import {HomeComponent} from "./home/home.component";
import {EditRideComponent} from "./edit-ride/edit-ride.component";

// Route Configuration
export const routes: Routes = [
  {path: '', component: HomeComponent},
  {path: 'rides', component: RideListComponent},
  {path: 'addride', component: AddRideComponent},
  {path: 'editride', component: EditRideComponent}

];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes);

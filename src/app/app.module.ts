import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app-routing.module';

// import { AngularFirestoreModule } from '@angular/fire/firestore';
import { AngularFireModule } from '@angular/fire/compat';
import { AngularFirestoreModule } from '@angular/fire/compat/firestore';
import { environment } from '../environments/environment';


import { AppComponent } from './app.component';
import { NavComponent } from './nav/nav.component';
import { TripsContainerComponent } from './trips-container/trips-container.component';
import { TripComponent } from './trip/trip.component';
import { TripsService } from './trips.service';
import { TripFormComponent } from './trip-form/trip-form.component';
import { TripRaitingComponent } from './trip-raiting/trip-raiting.component';
import { TripFilterComponent } from './trip-filter/trip-filter.component';
import { CartService } from './cart.service';
import { CartComponent } from './cart/cart.component';
import { HomeComponent } from './home/home.component';
import { DetailedCartComponent } from './detailed-cart/detailed-cart.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { TripReviewComponent } from './trip-review/trip-review.component';
import { HistoryComponent } from './history/history.component';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AuthService } from './auth.service';
import { ManagerPanelComponent } from './manager-panel/manager-panel.component';
import { TripEditComponent } from './trip-edit/trip-edit.component';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { PermissionsEditComponent } from './permissions-edit/permissions-edit.component';
import { HistoryPipe } from './pipes';

@NgModule({
  declarations: [
    AppComponent,
    NavComponent,
    TripsContainerComponent,
    TripComponent,
    TripFormComponent,
    TripRaitingComponent,
    TripFilterComponent,
    HistoryPipe,
    CartComponent,
    HomeComponent,
    DetailedCartComponent,
    PageNotFoundComponent,
    TripDetailComponent,
    TripReviewComponent,
    HistoryComponent,
    LoginComponent,
    RegisterComponent,
    ManagerPanelComponent,
    TripEditComponent,
    AdminPanelComponent,
    PermissionsEditComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ReactiveFormsModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebaseConfig),
    AngularFirestoreModule
  ],
  providers: [TripsService, CartService, AuthService],
  bootstrap: [AppComponent]
})
export class AppModule { }

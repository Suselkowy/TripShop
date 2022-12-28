import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminPanelComponent } from './admin-panel/admin-panel.component';
import { DetailedCartComponent } from './detailed-cart/detailed-cart.component';
import { AdminGuard } from './guard/admin.guard';
import { AuthGuard } from './guard/auth.guard';
import { LoggedInGuard } from './guard/logged-in.guard';
import { HistoryComponent } from './history/history.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { ManagerPanelComponent } from './manager-panel/manager-panel.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { PermissionsEditComponent } from './permissions-edit/permissions-edit.component';
import { RegisterComponent } from './register/register.component';
import { TripDetailComponent } from './trip-detail/trip-detail.component';
import { TripEditComponent } from './trip-edit/trip-edit.component';
import { TripFormComponent } from './trip-form/trip-form.component';
import { TripsContainerComponent } from './trips-container/trips-container.component';


const routes: Routes = [
  { path: 'home', component: HomeComponent },
  { path: 'login', component: LoginComponent, canActivate: [LoggedInGuard]},
  { path: 'register', component: RegisterComponent, canActivate: [LoggedInGuard]},
  { path: 'trips', component: TripsContainerComponent },
  { path: 'trips/:id', component: TripDetailComponent, canActivate:[AuthGuard]},
  { path: 'edit/:id', component: TripFormComponent, canActivate:[AuthGuard]},
  { path: 'admin', component: AdminPanelComponent, canActivate:[AdminGuard]},
  { path: 'admin/:id', component: PermissionsEditComponent, canActivate:[AdminGuard]},
  { path: 'manage', component: ManagerPanelComponent, canActivate:[AuthGuard]},
  { path: 'cart', component: DetailedCartComponent, canActivate:[AuthGuard]},
  { path: 'history', component: HistoryComponent, canActivate:[AuthGuard]},
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: '**', component: PageNotFoundComponent } 
];

@NgModule({
  imports: [RouterModule.forRoot(routes,{scrollPositionRestoration: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from
'@angular/router';
import { map, Observable } from 'rxjs';
import { AuthService } from '../auth.service';


@Injectable({
 providedIn: 'root'
})
export class LoggedInGuard implements CanActivate {
 constructor( public authService: AuthService, public router: Router )
 { }

 canActivate( next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean 
 {
  return this.authService.getAuthenticated().pipe(
    map((state) => {
      if (state !== null) {
        this.router.navigate(['home']);
        return false;
      }
      return true;
    })
  );
 }
}
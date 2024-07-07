import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  CanActivateChild,
  CanDeactivate,
  CanMatch,
  GuardResult,
  MaybeAsync,
  Route,
  Router,
  RouterStateSnapshot,
  UrlSegment,
} from '@angular/router';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard
  implements CanActivate, CanActivateChild, CanDeactivate<unknown>, CanMatch
{
  constructor(private httpClient: HttpClient, private router: Router) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const token = localStorage.getItem('token');
    if (!token) {
      this.router.navigateByUrl('/login');
      return false;
    }
    const header = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    try {
      const data = this.httpClient
        .get('https://finace-system-backend.onrender.com/auth/', {
          headers: header,
        })
        .pipe(
          map((data) => {
            console.log(data);
            if (!data) {
              return false;
            } else {
              return true;
            }
          }),
          catchError((err) => {
            this.router.navigateByUrl('/login');
            return of(false);
          })
        );
      return data;
    } catch (err) {
      console.log(err);
      this.router.navigateByUrl('/login');
      return false;
    }
  }
  canActivateChild(
    childRoute: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return true;
  }
  canDeactivate(
    component: unknown,
    currentRoute: ActivatedRouteSnapshot,
    currentState: RouterStateSnapshot,
    nextState?: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    return true;
  }
  canMatch(route: Route, segments: UrlSegment[]): MaybeAsync<GuardResult> {
    return true;
  }
}

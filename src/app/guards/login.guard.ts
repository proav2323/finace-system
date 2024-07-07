import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  GuardResult,
  MaybeAsync,
  Router,
  RouterStateSnapshot,
} from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LoginGuard implements CanActivate {
  constructor(
    private httpClient: HttpClient,
    private router: Router,
    private toast: ToastrService
  ) {}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): MaybeAsync<GuardResult> {
    const token = localStorage.getItem('token');
    if (!token) {
      return true;
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
              return true;
            } else {
              this.toast.error('logout first');
              this.router.navigateByUrl('/');
              return false;
            }
          }),
          catchError((err) => {
            return of(true);
          })
        );
      return data;
    } catch (err) {
      return true;
    }
  }
}

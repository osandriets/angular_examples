import { CanActivateFn, Router, UrlTree } from '@angular/router';
import { Observable } from "rxjs";
import { inject } from "@angular/core";
import { UserService } from "../services/user.service";


export const AuthGuard: CanActivateFn = ():
  Observable<boolean | UrlTree>
  | Promise<boolean | UrlTree>
  | boolean
  | UrlTree=> {

  return inject(UserService).authenticated()
    ? true
    : inject(Router).createUrlTree(['/login']);

};

import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take, switchMap, of } from 'rxjs';
import { UserService } from '../Services/user/user.service';

/**
 * Lets only admins load the admin area. The admin flag is re-checked with the
 * server on every match instead of trusting the value cached in sessionStorage.
 */
export const adminGuard: CanMatchFn = () => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.user$.pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        return of(router.createUrlTree(['/login']));
      }
      return userService.verifyIsAdmin(user.userID).pipe(
        map(isAdmin => isAdmin || router.createUrlTree(['/login']))
      );
    })
  );
};

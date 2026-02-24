import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take, switchMap } from 'rxjs';
import { UserServise } from '../Servises/UserServise/User-servise';


export const adminGuard: CanMatchFn = (route, segments) => {
  const userServise = inject(UserServise);
  const router = inject(Router);

  return userServise.user$.pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        router.navigate(['/login']);
        return [false];
      }
      return userServise.isAdmin$.pipe(
        take(1),
        map(isAdmin => {
          if (isAdmin) return true;
          router.navigate(['/login']);
          return false;
        })
      );
    })
  );
};
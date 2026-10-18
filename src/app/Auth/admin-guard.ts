import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { map, take, switchMap } from 'rxjs';
import { UserService } from '../Services/user/user.service';


export const adminGuard: CanMatchFn = (route, segments) => {
  const userService = inject(UserService);
  const router = inject(Router);

  return userService.user$.pipe(
    take(1),
    switchMap(user => {
      if (!user) {
        router.navigate(['/login']);
        return [false];
      }
      return userService.isAdmin$.pipe(
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
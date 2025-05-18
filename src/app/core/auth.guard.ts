import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { CanActivateFn } from '@angular/router';
import { Store } from '@ngrx/store';
import { filter, map } from 'rxjs/operators';
import { selectCurrentUser } from '../auth/store/reducers';

export const authGuard: CanActivateFn = (route, state) => {
  // console.log(route.data);
  const store = inject(Store);
  const router = inject(Router);
  return store.select(selectCurrentUser).pipe(
    map((currentUser) => {
      console.log(currentUser);
      if(!currentUser) {
        return router.createUrlTree(['/login']);
      } 
      return true;
      
    })
  )
  
};
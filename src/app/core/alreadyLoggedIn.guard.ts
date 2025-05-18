import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { map } from 'rxjs';
import { selectCurrentUser } from '../auth/store/reducers';

export const alreadyLoggedInGuard: CanActivateFn = (route, state) => {
  const store = inject(Store);
  const router = inject(Router);
  return store.select(selectCurrentUser).pipe(
    map((currentUser) => {
      if(!currentUser) {
        return true
      }else {
        return router.createUrlTree(['/']);
      }
    })
  )
  
};
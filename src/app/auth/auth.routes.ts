import {Route} from '@angular/router'
import {LoginComponent} from './components/login/login.component'
import {RegisterComponent} from './components/register/register.component'
import { alreadyLoggedInGuard } from '../core/alreadyLoggedIn.guard'

export const registerRoutes: Route[] = [
  {
    path: '',
    component: RegisterComponent,
    canActivate: [alreadyLoggedInGuard]
  },
]

export const loginRoutes: Route[] = [
  {
    path: '',
    component: LoginComponent,
    canActivate: [alreadyLoggedInGuard]
  },
]

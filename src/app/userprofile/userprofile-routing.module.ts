import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';
import {OrderHistoryComponent} from './order-history/order-history.component';
import {ForgotPswdComponent} from './forgot-pswd/forgot-pswd.component';

const routes: Routes = [
  // { path: '', redirectTo: 'profile', pathMatch: 'full' },
  // { path: 'profile', component: ProfileComponent },
  // { path: 'signin', component: SigninComponent },
  // { path: 'orders', component: OrderHistoryComponent },
  // { path: 'forgotpswd', component: ForgotPswdComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class UserprofileRoutingModule { }

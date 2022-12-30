import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserprofileRoutingModule } from './userprofile-routing.module';
import { UserprofileComponent } from './userprofile.component';
import { ProfileComponent } from './profile/profile.component';
import { SigninComponent } from './signin/signin.component';
import { OrderHistoryComponent } from "./order-history/order-history.component";

import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {
  MatToolbarModule, MatIconModule,
  MatButtonModule, MatInputModule,
  MatOptionModule, MatSelectModule,
  MatFormFieldModule, MatMenuModule,
  MatNativeDateModule
} from '@angular/material';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatListModule } from '@angular/material/list';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { ForgotPswdComponent } from '../userprofile/forgot-pswd/forgot-pswd.component';

@NgModule({
  declarations: [UserprofileComponent, ProfileComponent, OrderHistoryComponent, ForgotPswdComponent],
  imports: [
    CommonModule,
    UserprofileRoutingModule,
    FormsModule,
    ReactiveFormsModule,
    MatToolbarModule,
    MatListModule,
    MatButtonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    MatOptionModule,
    MatSelectModule,
    MatMenuModule,
    MatExpansionModule,
    MatDatepickerModule,
    MatNativeDateModule
  ],
  exports: [],
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class UserprofileModule { }

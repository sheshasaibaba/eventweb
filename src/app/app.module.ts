import { BrowserModule } from '@angular/platform-browser';
import { NgModule, NO_ERRORS_SCHEMA } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BcfeventsComponent, DialogOverviewExampleDialog } from './bcfevents/bcfevents.component';
import { MyEventComponent } from './my-event/my-event.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { FaqComponent } from './faq/faq.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

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

import { HttpClientModule } from '@angular/common/http';
import { EventlistComponent } from './eventlist/eventlist.component';

import { PaymentComponent } from './payment/payment.component';
import { from } from 'rxjs';
import { ContainerComponent } from './container/container.component';
import { ConditionsComponent } from './userprofile/conditions/conditions.component';
import { FailureComponent } from './order-failure/failure.component';
import { EmailverifyComponent } from './emailverify/emailverify.component';
import { MobileverifyComponent } from './mobileverify/mobileverify.component';
import { CancellationComponent } from './userprofile/cancellation/cancellation/cancellation.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SupportComponent } from './support/support.component';
import { WindowRef } from './services/windowRef.service';
import { UserprofileModule } from './userprofile/userprofile.module';
import { SigninComponent } from './userprofile/signin/signin.component';
import { LocationStrategy, HashLocationStrategy } from '@angular/common';
import { ShareButtonsModule } from 'ngx-sharebuttons';

@NgModule({
  declarations: [
    AppComponent,
    MyEventComponent,
    CheckoutComponent,
    BcfeventsComponent,
    EventlistComponent,
    PaymentComponent,
    FaqComponent,
    ContainerComponent,
    ConditionsComponent,
    FailureComponent,
    DialogOverviewExampleDialog,
    EmailverifyComponent,
    MobileverifyComponent,
    CancellationComponent,
    ContactUsComponent,
    SupportComponent,
    SigninComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
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
    MatNativeDateModule,
    MatTooltipModule,
    UserprofileModule,
    MatButtonModule,
    ShareButtonsModule.forRoot()
  ],
  entryComponents: [DialogOverviewExampleDialog, SigninComponent],
  providers: [{
    provide: LocationStrategy,
    useClass: HashLocationStrategy
  }, WindowRef],
  schemas: [NO_ERRORS_SCHEMA],
  bootstrap: [AppComponent]
})
export class AppModule { }

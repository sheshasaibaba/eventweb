import { NgModule } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { BcfeventsComponent } from './bcfevents/bcfevents.component';
import { MyEventComponent } from './my-event/my-event.component';
import { CheckoutComponent } from './checkout/checkout.component';
import { EventlistComponent } from './eventlist/eventlist.component';
import { PaymentComponent } from './payment/payment.component';
import { FaqComponent } from './faq/faq.component';
import { ContainerComponent } from './container/container.component';
import { ConditionsComponent } from './userprofile/conditions/conditions.component';
import { FailureComponent } from './order-failure/failure.component';
import { EmailverifyComponent } from './emailverify/emailverify.component';
import { MobileverifyComponent } from './mobileverify/mobileverify.component';
import { CancellationComponent } from './userprofile/cancellation/cancellation/cancellation.component';
import { ContactUsComponent } from './contact-us/contact-us.component';
import { SupportComponent } from './support/support.component';
import { SigninComponent } from './userprofile/signin/signin.component';
import { ProfileComponent } from './userprofile/profile/profile.component';
import { OrderHistoryComponent } from './userprofile/order-history/order-history.component';
import { ForgotPswdComponent } from './userprofile/forgot-pswd/forgot-pswd.component';

const routes: Routes = [
  { path: '', redirectTo: 'bcfevents', pathMatch: 'full' },
  { path: 'bcfevents', component: BcfeventsComponent },
  {
    path: '', component: ContainerComponent,
    children: [
      // { path: '', redirectTo: ':location/:category', pathMatch: 'full' },
      { path: ':location/:category', component: EventlistComponent },
      { path: ':location/:category/:event', component: MyEventComponent },
      { path: ':location/:category/:event/:tickets', component: CheckoutComponent },
      { path: 'faq', component: FaqComponent },
      { path: 'terms', component: ConditionsComponent },
      { path: 'cancellation-policy', component: CancellationComponent },
      { path: 'contact-us', component: ContactUsComponent },
      { path: 'support', component: SupportComponent },
      { path: 'profile', component: ProfileComponent },
      { path: 'orders', component: OrderHistoryComponent },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {
    preloadingStrategy: PreloadAllModules
  })],
  exports: [RouterModule]
})
export class AppRoutingModule { }

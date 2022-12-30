import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../services/app.service";
import {FormBuilder, FormGroup} from "@angular/forms";
import {HttpClient} from "@angular/common/http";

@Component({
  selector: 'app-payment',
  templateUrl: './payment.component.html',
  styles: []
})
export class PaymentComponent implements OnInit {

  public payuform: any = {};
  disablePaymentButton: boolean = true;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private trans: AppService,
      private router: Router,
      private http: HttpClient
  ) { }

  ngOnInit() {
  }

  confirmPayment() {
    const paymentPayload = {
      email: this.payuform.email,
      name: this.payuform.firstname,
      phone: this.payuform.phone,
      productInfo: this.payuform.productinfo,
      amount: this.payuform.amount
    }

    console.log(paymentPayload);

    return this.http.post<any>('http://localhost:8080/payment/payment-details', paymentPayload).subscribe(
        data => {
          console.log(data);
          this.payuform.txnid = data.txnId;
          this.payuform.surl = data.sUrl;
          this.payuform.furl = data.fUrl;
          this.payuform.key = data.key;
          this.payuform.hash = data.hash;
          this.payuform.txnid = data.txnId;
          this.disablePaymentButton = false;
        }, error1 => {
          console.log(error1);
        })

  }

}

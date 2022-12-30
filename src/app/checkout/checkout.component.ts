import { Component, OnInit, NgZone } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../services/app.service';
import { WindowRef } from '../services/windowRef.service';

declare var Payment: any;

@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent implements OnInit {

  eventId; NoOfTickets;
  userId;
  public eventinfo: { [id: string]: any; } = {};
  public eventdata: { [id: string]: any; } = {};
  checkoutForm: FormGroup;
  TicketPrice = 0;
  TotalTicketPrice = 0;
  submitted = false;
  bookingPlan: any[] = [];
  eventBookingDetails: any = {};
  couponCode = new FormControl('');
  hasDiscount = false;
  ticketDiscount = 0;
  availedDiscount: number;
  rzp1: any;
  event: any;
  totalTickts: any;
  pageRoute: string[];
  TxnId: any;
  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private trans: AppService,
    private router: Router,
    private winRef: WindowRef,
    private ngZone: NgZone
  ) { }

  ngOnInit() {
    if (!localStorage.getItem('UserId')) {
      this.router.navigate(['/bcfevents']);
      return false;
    } else {
      this.userId = localStorage.getItem('UserId');
    }
    this.pageRoute = this.router.url.split('/');
    const eventNameId = this.pageRoute[3];
    this.event = JSON.parse(localStorage.getItem('event'));
    this.totalTickts = JSON.parse(localStorage.getItem('totalTickets'));
    this.EventData(eventNameId);
    let eventId = '';
    if (!this.event) {
      eventId = eventNameId.split('_')[0];
    }
    console.log(this.eventId);
    this.checkoutForm = this.formBuilder.group({
      EventId: this.event ? this.event.EventId : eventId,
      NoOfTickets: 0,
      PickupId: new FormControl('', Validators.required),
      Remarks: '', Amount: 0,
      EventDate: new FormControl('', Validators.required),
      registries: new FormArray([]),
      RequestBy: localStorage.getItem('UserId')
    });

    for (let i = 0; i < this.totalTickts; i++) {
      this.addExtra();
    }
    const bkngDetails: any = JSON.parse(localStorage.getItem('bookingDetails'));
    this.eventBookingDetails = bkngDetails.titcketDetails;
    this.bookingPlan = bkngDetails.bdata;
    console.log(this.eventBookingDetails);
    console.log(this.bookingPlan);
  }

  EventData(eventNameId) {
    const call = { action: 'eventinfo', eventId: eventNameId };
    console.log(call);
    this.trans.EventCtrl(call)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.status === 'SUCCESS') {
            this.eventinfo = res.data;
            this.eventdata = this.eventinfo.eventinfo;
            this.event = this.event ? this.event : this.eventdata;
          } else {
            this.eventinfo = [];
          }
          console.log(this.eventinfo);
        },
        err => {
          console.log(err);
        }
      );
  }

  get checkout() { return this.checkoutForm.controls; }
  get extraUsers() {
    return this.checkoutForm.get('registries') as FormArray;
  }

  addExtra() {
    const group = new FormGroup({
      CustomerName: new FormControl('', Validators.required),
      Gender: new FormControl('', Validators.required),
      Age: new FormControl('', Validators.required),
      Email: new FormControl('', Validators.required),
      ContactNo: new FormControl('', Validators.required),
      TicketType: new FormControl('')
    });
    this.extraUsers.push(group);
  }

  removeExtraUser(index: number) {
    this.extraUsers.removeAt(index);
    // this.NoOfTickets -= 1;
    // this.TotalTicketPrice = this.eventinfo.EventPrice * this.NoOfTickets;
  }

  CheckoutReg() {

    if (this.checkoutForm.invalid) {
      console.log('Form Invalid');
      return;
    }

    const data = this.checkoutForm.value;
    data.action = 'ticketbooking';
    data.Amount = this.eventBookingDetails.totalBookingPrice * 100;
    data.NoOfTickets = this.eventBookingDetails.noOfTickets;
    data.plans = this.bookingPlan;
    this.submitted = true;

    // console.log(JSON.stringify(data));
    // return false;
    this.submitted = true;

    this.trans.CustomerCtrl(data)
      .subscribe(
        (res) => {
          console.log(res);
          this.submitted = false;
          if (res.status === 'SUCCESS') {
            const orderData = res.data;
            orderData.order_id = res.order_id;
            this.TxnId = orderData.txnid;
            this.payment(orderData);
          } else {
            alert('Something Went Wrong');
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  goBack() {
    this.router.navigate(['/home/event/' + this.eventId]);
  }

  submitCoupon() {
    console.log('coupon');
    const couponData = {
      action: 'apply_coupon',
      coupon_code: this.couponCode.value,
      userId: this.userId
    };
    this.trans.EventCtrl(couponData)
      .subscribe(
        (res) => {
          // console.log(res);
          this.submitted = false;
          if (res.status === 'SUCCESS') {
            if (res.discount) {
              this.ticketDiscount = res.discount;
              this.availedDiscount = (this.eventBookingDetails.totalBookingPrice * (this.ticketDiscount / 100));
              this.eventBookingDetails.totalBookingPrice = this.eventBookingDetails.totalBookingPrice - this.availedDiscount;
              this.hasDiscount = true;
              alert('coupon applied successfully');
            }
          } else {
            alert(res.response);
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  payment(value) {
    const options = {
      key: 'rzp_live_3UOKhtQEdeSxjD',
      amount: value.amount * 100,
      name: value.fname,
      description: 'Payment for' + value.pinfo,
      image: '../images/payment-logo.jpg',
      handler: this.paymentCapture.bind(this),
      prefill: {
        name: value.fname,
        email: value.email
      },
      theme: {
        color: '#BB070A'
      },
      order_id: value.order_id,
      modal: {
        ondismiss: this.closePop.bind(this)
      }
    };
    this.rzp1 = new this.winRef.nativeWindow.Razorpay(options);
    this.rzp1.open();
  }

  paymentCapture(response) {
    console.log(response);
    const paymentId = response.razorpay_payment_id;
    // TODO
    // if payment success => ticket-booking call update payments(order-histroy)
    if (paymentId) {
      this.UpdatePayments();
      this.routeToOrderHistory();
    } else {
      alert('payment failed');
    }
  }
  routeToOrderHistory() {

    this.ngZone.run(() => {
      this.router.navigate(['/orders']);
    });
  }
  closePop(res) {
    alert('payment cancelled');
  }
  UpdatePayments() {
    let txnstat = '';
    const call = { action: 'update_payments', txnid: this.TxnId, txnstat };
    this.trans.CustomerCtrl(call)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.status == 'SUCCESS') {
            localStorage.removeItem('TxnId');
            localStorage.removeItem('TxnStatus');
            // alert("Your Tranaction has been completed.");
          } else {
            // alert("Something went worng");
          }
        },
        err => {
          console.log(err);
        }
      );
  }
}

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';
import { AppService } from '../services/app.service';
import { CarouselConfig } from 'ngx-bootstrap';
import { MatDialog } from '@angular/material';
import { SigninComponent } from '../userprofile/signin/signin.component';


@Component({
  selector: 'app-my-event',
  templateUrl: './my-event.component.html',
  styleUrls: ['./my-event.component.css'],
  providers: [
    { provide: CarouselConfig, useValue: { interval: 1500, noPause: false } },
  ]
})
export class MyEventComponent implements OnInit {
  eventLocation: any = 'https://goo.gl/maps/8y7jm4ae3tnciR6W6';
  public selectedEvent: any;
  public eventinfo: { [id: string]: any; } = {};
  public eventdata: { [id: string]: any; } = {};

  myInterval: number | false = 6000;
  slides: any[] = [];
  activeSlideIndex = 0;
  noWrapSlides = false;
  bookingPlan: any[] = [];
  bdata: any = {};
  eventPreferences: any[] = [];
  eventsPlansInfo: any;
  userLoc: any;
  locationName: any;
  category: any = {};
  pageRoute: string[];
  categoryName: string;
  totalTicketsExists = '';
  constructor(
    private event: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private dialog: MatDialog
  ) { }
  TotalTickets = 0;
  TicketPrice = 0;

  ngOnInit() {
    let eventIdName = '';
    let eventLoc = '';
    let eventCat = '';
    this.route.url.subscribe(url => {
      eventLoc = url[0].path;
      eventCat = url[1].path;
      eventIdName = url[2].path;
    });
    this.eventsPlansInfo = JSON.parse(localStorage.getItem('eventsPlansInfo'));
    this.selectedEvent = JSON.parse(localStorage.getItem('event'));
    this.userLoc = JSON.parse(localStorage.getItem('location'));
    this.category = JSON.parse(localStorage.getItem('category'));
    // if (this.userLoc) {
    //   this.locationName = this.userLoc.LocationName;
    // } else {
    this.locationName = eventLoc;
    // }
    if (!this.category) {
      this.categoryName = eventCat;
    }
    if (eventIdName) {
      this.EventData(eventIdName);
    }
  }

  EventData(eventIdName) {
    const call = { action: 'eventinfo', eventId: eventIdName };
    console.log(call);
    this.event.EventCtrl(call)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.status === 'SUCCESS') {
            this.eventinfo = res.data;
            console.log(this.eventinfo.plans);
            // if (this.eventsPlansInfo) {
            //   this.eventinfo.plans = this.eventsPlansInfo;
            // }
            localStorage.setItem('eventsPlansInfo', JSON.stringify(this.eventinfo.plans));
            this.TicketPrice = this.eventinfo.EventPrice;
            this.eventdata = this.eventinfo.eventinfo;
            this.eventPreferences = this.eventinfo.preferences;
            localStorage.setItem('eventPreferences', JSON.stringify(this.eventPreferences));
            for (let i = 0; i < this.eventinfo.plans.length; i++) {
              this.eventinfo.plans[i].BookTickets = 1;
              this.TotalTickets += 1;
            }
            // for(slider of this.eventinfo.gallery)
            /*
            this.slides.push({
                image: `https://lorempixel.com/900/500/abstract/${this.slides.length % 8 + 1}/`
            });
            */
          } else {
            this.eventinfo = [];
          }
          // console.log(this.eventinfo);
        },
        err => {
          console.log(err);
        }
      );
  }

  manageTicket(type: string, index: number) {
    if (type === 'sub') {
      if (this.eventinfo.plans[index].BookTickets > 0) {
        this.eventinfo.plans[index].BookTickets -= 1;
        this.TotalTickets -= 1;
      }
    } else {
      if (this.eventinfo.plans[index].AvailTickets > this.eventinfo.plans[index].BookTickets) {
        this.eventinfo.plans[index].BookTickets += 1;
        this.TotalTickets += 1;
      }
    }
    // localStorage.setItem('eventsPlansInfo', JSON.stringify(this.eventinfo.plans));
  }

  Checkout() {
    this.calcTotalPrice();
    if (!localStorage.getItem('UserId')) {
      alert('Please Signin for Ticket Booking');
      const dialogRef = this.dialog.open(SigninComponent, {
        width: '35vw',
        minWidth: '350px',
        disableClose: true,
        hasBackdrop: true
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          if (result === 'success') {
            this.routeToCheckout();
          }
        }
      });
    } else {
      this.routeToCheckout();
    }
  }

  routeToCheckout() {
    let eventIdName = '';
    if (this.selectedEvent) {
      const eventName = this.selectedEvent.EventName.replace(/\s/g, '');
      eventIdName = this.selectedEvent.EventId + '_' + eventName;
    } else {
      const eventName = this.eventdata.EventName.replace(/\s/g, '');
      eventIdName = this.eventdata.EventId + '_' + eventName;
    }
    localStorage.setItem('totalTickets', JSON.stringify(this.TotalTickets));
    this.router.navigate([this.locationName, (this.category && this.category.NAME) ? this.category.NAME : this.categoryName,
      eventIdName, this.TotalTickets]);
  }
  calcTotalPrice() {
    const plans = this.eventinfo.plans;
    const noOfTickets = this.TotalTickets;
    let totalPrice = 0;
    plans.forEach(bkplan => {
      if (bkplan.BookTickets > 0) {
        totalPrice += (bkplan.EventPrice - ((bkplan.Discount / 100) * bkplan.EventPrice)) * (bkplan.BookTickets);
        const plan = {
          TicketType: bkplan.TicketType,
          TicketTypeName: bkplan.TicketTypeName,
          noOfTickets: bkplan.BookTickets,
          eventPrice: bkplan.EventPrice,
          totalPrice
        };
        this.bookingPlan.push(plan);
      }
    });
    const titcketDetails = {
      totalBookingPrice: totalPrice,
      noOfTickets: this.TotalTickets
    };
    this.bdata = {
      titcketDetails,
      bdata: this.bookingPlan
    };
    localStorage.setItem('bookingDetails', JSON.stringify(this.bdata));
  }
}

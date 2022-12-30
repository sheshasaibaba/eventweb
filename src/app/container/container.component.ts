
import { ChangeDetectorRef, Component, OnInit, NgZone } from '@angular/core';
// NavigationEnd loads from top
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { AppService } from '../services/app.service';
import { SigninComponent } from '../userprofile/signin/signin.component';
import { MatDialog } from '@angular/material';
import { Location } from '@angular/common';
export interface location {
  value: string;
  viewValue: string;
}
declare const google: any;
@Component({
  selector: 'app-container',
  templateUrl: './container.component.html',
  styleUrls: ['./container.component.css']
})
export class ContainerComponent implements OnInit {
  isEventPage: Boolean = false;
  locationName: any;
  isEventListPage: Boolean = false;
  category: any;
  userLoc: any;
  event: any;
  evenNameId = '';
  CategoryList: any = [];
  userNotifications: any = [];
  constructor(
    private appserv: AppService,
    private router: Router,
    private cdref: ChangeDetectorRef,
    private ngZone: NgZone,
    private dialog: MatDialog,
    private location: Location,
    private route: ActivatedRoute
  ) {
    this.LocationList();
  }
  username: string;
  userid: any;
  selectedLocation: any;
  disabledSelect = false;
  pageRoute: any = [];
  detectedLocation = '';
  detectedCity = '';
  dontRoute: Boolean = false;
  eventRoute: Boolean = false;
  title = 'EventManagement';
  locations = [];
  panelOpenState = false;

  ngOnInit() {
    this.appserv.AuthUser.subscribe(d => this.userid = d);
    this.appserv.AuthUserNameval.subscribe(d => this.username = d);
    this.appserv.userLocationValue.subscribe(d => {
      this.userLoc = d;
      this.selectedLocation = this.userLoc.LocationId;
    });
    this.pageRoute = this.router.url.split('/');
    const length = this.pageRoute.length;
    const event = JSON.parse(localStorage.getItem('event'));
    this.event = event;
    const totalTickts = JSON.parse(localStorage.getItem('totalTickets'));
    this.category = JSON.parse(localStorage.getItem('category'));
    this.appserv.selectedCategoryValue.subscribe(data => {
      this.category = data;
    });
    let eventNameId = '';
    if (event) {
      const eventName = event.EventName.replace(/\s/g, '');
      eventNameId = event.EventId + '_' + eventName;
    } else {
      eventNameId = this.pageRoute[3];
    }
    if (eventNameId && this.pageRoute[length - 1] === eventNameId) {
      this.isEventPage = true;
      this.disabledSelect = false;
    } else if (totalTickts && (this.pageRoute[length - 1].toString() === totalTickts.toString())) {
      this.disabledSelect = true;
    } else if (this.category && this.pageRoute[length - 1] === this.category.NAME) {
      this.disabledSelect = false;
      this.isEventListPage = true;
    }
    this.evenNameId = eventNameId;
    const userLoc: any = JSON.parse(localStorage.getItem('location'));
    if (userLoc) {
      this.selectedLocation = userLoc.LocationId;
    }
    this.appserv.ChangeAuthSource(this.userid, this.username);

    // loads from top when navigate to new page
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0);
    });
    this.CategoriesList();
    this.getNotifications();
  }

  LocationList() {
    const call = { action: 'locations' };
    this.appserv.MasterCtrl(call)
      .subscribe(
        (res) => {
          if (res.status === 'SUCCESS') {
            this.locations = res.data;
            // if (!this.selectedLocation) {
            const locationNameFrmUrl = this.pageRoute[1];
            const loc: any = this.locations.filter(item => item.LocationName === locationNameFrmUrl);
            this.selectedLocation = loc[0].LocationId;
            // }
          } else {
            this.locations = [];
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  SelectiveLocation(loc) {
    this.selectedLocation = loc;
    this.getLocation(loc);
  }
  getLocation(locId) {
    if (this.locations) {
      const location = this.locations.filter(loc => loc.LocationId === locId);
      if (location.length > 0) {
        const userLocation = location[0];
        this.locationName = userLocation.LocationName;
        this.appserv.changeLocation(userLocation);
        localStorage.setItem('location', JSON.stringify(userLocation));
        if (this.isEventPage) {
          if (this.category) {
            this.router.navigate(['/', this.locationName, this.category.NAME]);
          } else {
            const category = this.filerCategory(this.event.EventCategoryId);
            this.router.navigate(['/', this.locationName, category[0].NAME]);
          }
        } else if (this.isEventListPage) {
          this.router.navigate(['/', this.locationName, this.category.NAME]);
        } else {
          this.router.navigate(['/bcfevents']);
        }

      }
    }
  }
  CategoriesList() {
    const call = { action: 'categories' };
    this.appserv.MasterCtrl(call)
      .subscribe(
        (res) => {
          if (res.status === 'SUCCESS') {
            this.CategoryList = res.data;
          } else {
            this.CategoryList = [];
          }
        },
        err => {
          console.log(err);
        }
      );
  }
  filerCategory(catId) {
    const category = this.CategoryList.filter(item => item.ID === catId);
    return category;
  }
  Logout() {
    localStorage.clear();
    this.userid = this.username = '';
    this.appserv.ChangeAuthSource('', '');
    this.router.navigate(['/bcfevents']);
  }

  goBack() {
    this.location.back();
  }
  findMe() {
    let lat: number;
    let long: number;
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        lat = position.coords.latitude;
        long = position.coords.longitude;
        const geocoder = new google.maps.Geocoder();
        const latlng = new google.maps.LatLng(lat, long);
        const request = {
          latLng: latlng
        };
        if (!this.eventRoute) {
          geocoder.geocode(request, (results, status) => {
            if (status === google.maps.GeocoderStatus.OK) {
              if (results[0] != null) {
                results[0].address_components.forEach(element => {
                  element.types.forEach(type => {
                    if (type === 'locality') {
                      this.detectedCity = element.short_name;
                      const eventPref = JSON.parse(localStorage.getItem('eventPreferences'));
                      const hasPReferedloc = eventPref.find(item => item.LocationName === this.detectedCity);
                      if (!hasPReferedloc && !this.eventRoute) {
                        alert('Current event is not in your location');
                        this.SelectiveLocation(eventPref[0].LocationId);
                      } else if (hasPReferedloc && !this.eventRoute) {
                        this.dontRoute = true;
                        this.selectedLocation = hasPReferedloc ? hasPReferedloc.LocationId : null;
                        localStorage.setItem('locid', this.selectedLocation);
                        this.SelectiveLocation(this.selectedLocation);
                      }
                    }
                  });
                });
              } else {
                alert('No address available');
              }
            }
          });
        }
      });
    } else {
      alert('Geolocation is not supported by this browser.');
    }

  }
  goToSignIn() {
    const dialogRef = this.dialog.open(SigninComponent, {
      width: '35vw',
      minWidth: '350px',
      disableClose: true,
      hasBackdrop: true
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result === 'success') {
        this.getNotifications();
      }
    });
  }
  getNotifications() {
    const call = { action: 'Notifications_user', UserId: this.userid };
    console.log(call);
    this.appserv.CustomerCtrl(call)
      .subscribe(
        (res) => {
          if (res.status === 'SUCCESS') {
            console.log(res);
            this.userNotifications = res.data;
          }
        });
  }
  closeNotifications(notification: any) {
    const call = { action: 'Notifications_status', UserId: this.userid, Id: notification.id };
    console.log(call);
    this.appserv.CustomerCtrl(call)
      .subscribe(
        (res) => {
          if (res.status === 'SUCCESS') {
            console.log(res);
            this.getNotifications();
          } else {
            alert('notifications error');
          }
        });
  }
}

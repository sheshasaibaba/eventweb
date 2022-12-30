import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
//NavigationEnd loads from top
import { Router, NavigationEnd } from '@angular/router';
import { AppService } from "./services/app.service";
import { WindowRef } from './services/windowRef.service';
export interface location {
  value: string;
  viewValue: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  username: string;
  userid: any;
  rzp1: any;
  title = 'EventManagement';

  location: location[] = [
    { value: 'Delhi', viewValue: 'Delhi' },
    { value: 'Chennai', viewValue: 'Chennai' },
    { value: 'Hyderabad', viewValue: 'Hyderabad' }
  ];
  panelOpenState = false;
  orderData: any = {};
  constructor(
    private winRef: WindowRef,
    private appserv: AppService,
    private router: Router,
    private cdref: ChangeDetectorRef
  ) { }

  ngOnInit() {
    console.log(this.router.config);
    // this.initPay();
    if (localStorage.getItem('UserName') != undefined) {
      this.username = localStorage.getItem('UserName');
      this.userid = localStorage.getItem('UserId');
    } else {
      this.username = '';
      this.userid = '';
    }
    this.appserv.ChangeAuthSource(this.userid, this.username);

    //loads from top when navigate to new page 
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }

  Logout() {
    localStorage.clear();

    this.userid = this.username = '';
    this.appserv.ChangeAuthSource('', '');
    this.router.navigate(['bcfevents']);
  }

}

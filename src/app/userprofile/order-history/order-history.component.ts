import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../services/app.service";
import { FormControl } from "@angular/forms";

@Component({
  selector: 'app-order-history',
  templateUrl: './order-history.component.html',
  styleUrls: ['./order-history.component.css']
})
export class OrderHistoryComponent implements OnInit {
  public historylist = [];
  userId;
  constructor(
    private eventinfo: AppService,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit() {

    if (localStorage.getItem('UserId') == undefined) {
      // this.router.navigate( ['bcfevents']);
    }
    else
      this.userId = localStorage.getItem('UserId');
    this.HistoryList();
  }

  HistoryList() {
    let call = { 'action': 'history', "RequestBy": this.userId };
    this.eventinfo.CustomerCtrl(call)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.status == 'SUCCESS')
            this.historylist = res.data;
          else
            this.historylist = [];

          // console.log(this.eventslist);
        },
        err => {
          console.log(err);
        }
      );
  }

}

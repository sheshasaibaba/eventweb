import { Component, OnInit } from '@angular/core';
import {AppService} from "../services/app.service";
import {ActivatedRoute, Router} from "@angular/router";

@Component({
  selector: 'app-emailverify',
  templateUrl: './emailverify.component.html',
  styles: []
})
export class EmailverifyComponent implements OnInit {

  public verificationcode;
  isVerified = 1;
  isSubmited: boolean= false;
  constructor(
      private trans: AppService,
      private router: Router,
      private route: ActivatedRoute
  ) { }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.verificationcode = params['id']; // (+) converts string 'id' to a number
        console.log(this.verificationcode);
      this.VerirfyEmail();
    });
  }


  VerirfyEmail()
  {
      this.isSubmited = true;
    let call = { 'action': 'verifyemail', "code":  this.verificationcode};
    this.trans.AuthCtrl(call)
        .subscribe(
            (res) => {
              console.log(res);
              console.log("status :"+ res.status);
              if (res.status == 'SUCCESS') {
                  this.isVerified = 200;
                  alert(res.response);
                  this.router.navigate( ['home/user/signin']);
              }
              else
              {
                  this.isVerified = 201;
                  alert(res.response);
              }
            },
            err => {
              console.log(err);
            }
        );
  }

}
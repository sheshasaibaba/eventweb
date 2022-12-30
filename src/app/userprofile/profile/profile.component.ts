import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from "@angular/router";
import { AppService } from "../../services/app.service";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { MustMatch } from "../../_helpers/must-match.validator";

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  UserId;
  UpdatepasswordForm: FormGroup;
  submitted: boolean = false;
  public customerinfo: { [id: string]: any; } = {};
  constructor(
    private trans: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
  ) { }

  ngOnInit() {
    this.UpdatepasswordForm = this.formBuilder.group(
      {

        currentPassword: ['', [Validators.required, Validators.minLength(6)]],
        newPassword: ['', [Validators.required, Validators.minLength(6)]],
        newcnfPassword: ['', [Validators.required, Validators.minLength(6)]]
      },
      {
        validator: MustMatch('newPassword', 'newcnfPassword')
      });
    this.UserId = localStorage.getItem('UserId');

    if (this.UserId == undefined)
      this.router.navigate(['bcfevents']);
    this.UserProfile();
  }

  get reg() {
    console.log(this.UpdatepasswordForm.controls);
    return this.UpdatepasswordForm.controls;
  }

  UserProfile() {
    console.log("User Profile Called");

    let call = { action: 'customerinfo', UserId: this.UserId };
    this.trans.CustomerCtrl(call)
      .subscribe(
        (res) => {
          console.log(res);
          if (res.status == 'SUCCESS') {
            this.customerinfo = res.data;
          }
          else {
            alert("Something Went Wrong");
          }
        },
        err => {
          console.log(err);
        }
      );
  }

  UpdatePassword() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.UpdatepasswordForm.invalid) {
      console.log("Form Invalid");
      return;
    }

    let data = this.UpdatepasswordForm.value;
    data.action = 'updatepassword';
    data.RequestBy=this.UserId;
    //  console.log(JSON.stringify(data));
    // return false;
    this.trans.AuthCtrl(data)
        .subscribe(
            (res) => {
                 console.log(res);
                if(res.status == 'SUCCESS')
                    alert("Password Updated, Please Login");
                else
                    alert("Invalid Credentials");
                this.submitted = false;
                this.UpdatepasswordForm.reset();
            },
            err => {
                console.log(err);
            }
        );

  }

}

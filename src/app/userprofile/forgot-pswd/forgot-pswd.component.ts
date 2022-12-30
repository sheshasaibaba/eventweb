import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../../services/app.service";

@Component({
  selector: 'app-forgot-pswd',
  templateUrl: './forgot-pswd.component.html',
  styleUrls: ['./forgot-pswd.component.css']
})
export class ForgotPswdComponent implements OnInit {


  forgotForm: FormGroup;
  submitted = false;
  responseStat = '';
  constructor(
      private trans: AppService,
      private route: ActivatedRoute,
      private router: Router,
      private formBuilder: FormBuilder
  ) { }

  ngOnInit() {
    if (localStorage.getItem('UserName') == undefined) {
      // this.router.navigate(['bcfevents']);
    }

    this.forgotForm = this.formBuilder.group(
      {
        Email: ['', [Validators.required, Validators.email]]
      });
  }

  get reg() { return this.forgotForm.controls; }

  SendRequest()
  {
    this.submitted = true;
    if (this.forgotForm.invalid) {
      return;
    }

    let data = {action : 'forgotpswd', Email: this.forgotForm.get('Email').value };
    // return false;
    this.trans.AuthCtrl(data)
        .subscribe(
            (res) => {
              // console.log(res);
                this.submitted = false;
                this.forgotForm.reset();
              if (res.status == 'SUCCESS') {
                this.responseStat = 'Login Credentials sent to your Mail ID, please login with new credentials';
		alert(this.responseStat);
   		let fromFromPassord: boolean = true;
                localStorage.setItem('routePath', JSON.stringify(fromFromPassord));
		this.router.navigate(['/home/user/signin']);
              }
              else{
                this.responseStat = res.response;
		alert(this.responseStat);
              }
            },
            err => {
              console.log(err);
            }
        );

  }

}

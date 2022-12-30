import { Component, OnInit } from '@angular/core';
import {FormArray, FormBuilder, FormControl, FormGroup, Validators} from "@angular/forms";
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from "../services/app.service";

@Component({
  selector: 'app-support',
  templateUrl: './support.component.html',
  styleUrls: ['./support.component.css']
})
export class SupportComponent implements OnInit {

	supportForm: FormGroup;
	submitted = false;
  constructor(
      private formBuilder: FormBuilder,
      private route: ActivatedRoute,
      private trans: AppService,
      private router: Router
  ) { }

  ngOnInit() {
	this.supportForm = this.formBuilder.group({
          UserName: new FormControl('', Validators.required),
          Email: ['', [Validators.required, Validators.email]],
          Remarks: new FormControl('', Validators.required)
      });
  }
  
  get support() { return this.supportForm.controls; }
  
  SendRemarks()
  {
	this.submitted = true;
	if (this.supportForm.invalid) {
          console.log("Form Invalid");
          return;
      }
	  
	  let data = this.supportForm.value;
	data.action = 'user_remarks';
	  
	  this.trans.CustomerCtrl(data)
        .subscribe(
            (res) => {
              // console.log(res);
                this.submitted = false;
              if(res.status == 'SUCCESS')
              {
                this.supportForm.reset();
				alert("Your Request Sent Successfully");
              }
              else
              {
                // alert("Something Went Wrong");
              }
            },
            err => {
              console.log(err);
            }
        );
  
  }

}

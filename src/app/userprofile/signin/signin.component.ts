import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AppService } from '../../services/app.service';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MustMatch } from '../../_helpers/must-match.validator';
import { Location } from '@angular/common';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from 'src/app/bcfevents/bcfevents.component';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

  public Login = { UserId: '', Password: null, ConfirmPassword: '', UserName: '', UserPro: '' };
  signupForm: FormGroup;
  submitted = false;
  signinTab = 'active';
  activeTab = 'signin';
  signupTab = '';
  userResponse: any;
  isUserIDMail: Boolean = false;
  OTPValidating: Boolean = false;
  showCreateLogin = false;
  loginView = 'enterId';
  OTPError = false;
  status: Number = 1;
  registerdId = '';
  resendOTPStatus: Number;
  UserPattern: string;
  otpForm: FormGroup;
  constructor(
    private trans: AppService,
    private route: ActivatedRoute,
    private router: Router,
    private formBuilder: FormBuilder,
    private _location: Location,
    public dialogRef: MatDialogRef<SigninComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData
  ) { }

  ngOnInit() {
    this.signupForm = this.formBuilder.group(
      {
        CustomerName: ['', Validators.required],
        ContactNo: ['', [Validators.required, Validators.pattern('[6-9]{1}[0-9]{9}')]],
        Email: ['', [Validators.required, Validators.email]],
        Password: [null, [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required],
        TermsCondiations: [false, Validators.requiredTrue]
      },
      {
        validator: MustMatch('Password', 'confirmPassword')
      });

    this.otpForm = this.formBuilder.group({
      otp1: ['', [Validators.required, Validators.maxLength(1)]],
      otp2: ['', [Validators.required, Validators.maxLength(1)]],
      otp3: ['', [Validators.required, Validators.maxLength(1)]],
      otp4: ['', [Validators.required, Validators.maxLength(1)]],
      otp5: ['', [Validators.required, Validators.maxLength(1)]],
      otp6: ['', [Validators.required, Validators.maxLength(1)]]
    });
    console.log(this.Login);

  }

  LoginApp(password, status) {
    console.log(this.registerdId);
    console.log(this.isUserIDMail);
    if (this.registerdId.includes('@')) {
      this.isUserIDMail = true;
      this.UserPattern = '([6-9]{1}[0-9]{9})$';
    } else {
      this.isUserIDMail = false;
      this.UserPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
    }
    let data = {};
    if (status === 2) {
      data = {
        action: 'login', UserId: this.registerdId, UserId1: this.Login.UserPro,
        UserName: this.Login.UserName, Password: password, Status: status
      };
    } else {
      data = { action: 'login', UserId: this.Login.UserId, Password: password, Status: status };
    }
    this.trans.AuthCtrl(data)
      .subscribe(
        (res) => {
          console.log(this.userResponse);
          this.userResponse = res;
          if (this.userResponse.Status === '1') {
            this.loginView = 'enterId';
          } else if (this.userResponse.Status === '2') {
            // Case 2 -- New user
            // send OTP to user
            this.loginView = 'enterOTP';
            this.registerdId = this.userResponse.UserId;
            // this.Login.UserId = '';
            this.resendOTPStatus = 1;
          } else if (this.userResponse.Status === '4') {
            // Case 4 -- OLD user
            // validate user
            this.status = this.userResponse.Status;
            this.loginView = 'enterOldCred';
          } else if (this.userResponse.Status === '6') {
            alert('Successfully Loged In');
            localStorage.setItem('UserId', res.UserId);
            localStorage.setItem('UserName', res.UserName);
            this.trans.ChangeAuthSource(res.UserId, res.UserName);
            this.dialogRef.close('success');
          } else if (this.userResponse.Status === '7') {
            console.log(this.userResponse);
            console.log(this.Login);
            alert(this.Login.UserPro + ' already registered with another account');
            this.dialogRef.close('alreadyRegistered');
          } else if (this.userResponse.Status === '5') {
            this.resendOTPStatus = 3;
            this.loginView = 'enterOTP';
            // this.registerdId = this.userResponse.UserId;
            // this.Login.UserId = '';
          } else if (this.userResponse.Status === '8') {
            alert(this.Login.UserId + ' associated account cannot be found');
          } else if (this.userResponse.Status === '12') {
            alert('Invalid login credentials');
          }
          // else {
          //   alert(res.response);
          // }
        },
        err => {
          console.log(err);
        }
      );

  }

  validateOTP() {
    let inputData = '';
    Object.keys(this.otpForm.controls).forEach((key) => {
      inputData = inputData.concat(this.otpForm.get(key).value);
    });
    console.log(this.userResponse);
    if (inputData.length === 6 && !this.OTPValidating) {
      this.OTPValidating = true;
      this.userResponse.Password = this.userResponse.Password.toString();
      inputData = inputData.toString();
      if ((inputData === this.userResponse.Password) && this.userResponse.Status === '2') {
        this.loginView = 'enterLoginCred';
        this.status = this.userResponse.Status;
        this.registerdId = this.userResponse.UserId;
        if (this.registerdId.includes('@')) {
          this.isUserIDMail = true;
          this.UserPattern = '([6-9]{1}[0-9]{9})$';
        } else {
          this.isUserIDMail = false;
          this.UserPattern = '[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,3}$';
        }
      } else if ((inputData === this.userResponse.Password) && this.userResponse.Status === '5') {
        this.loginView = 'enterForgotPassword';
      } else {
        this.OTPValidating = false;
        this.OTPError = true;
      }
    } else {
      this.OTPValidating = false;
      this.OTPError = true;
    }
    console.log(this.Login);
  }
  registerUser() {
    this.loginView = 'enterOldCred';
  }
  resendOTP() {
    this.OTPError = false;
    this.otpForm.reset();
    this.LoginApp(null, this.resendOTPStatus);
  }
  clearOtp() {
    this.otpForm.reset();
  }
  getCodeBoxElement(index): any {
    return document.getElementById('codeBox' + index);
  }
  onKeyUpEvent(index, event) {
    const eventCode = event.which || event.keyCode;
    const value = this.getCodeBoxElement(index);
    if (this.getCodeBoxElement(index).value.length === 1) {
      if (index !== 6) {
        this.getCodeBoxElement(index + 1).focus();
      } else {
        this.getCodeBoxElement(index).blur();
        // Submit code
        this.validateOTP();
      }
    }
    if (eventCode === 8 && index !== 1) {
      this.getCodeBoxElement(index - 1).focus();
    }
  }
  onFocusEvent(index) {
  }
  onNoClick() {
    this.dialogRef.close();
  }
}

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { emailValidator, matchingPasswords } from '../../theme/utils/app-validators';
import {ActivatedRoute, Router} from "@angular/router";
import {AppService} from '../../app.service'

@Component({
  selector: 'app-change-password',
  templateUrl: './change-password.component.html',
  styleUrls: ['./change-password.component.scss']
})
export class ChangePasswordComponent implements OnInit {
  infoForm: FormGroup;
  passwordForm: FormGroup;
  token: string;
  sub: any;

  constructor(public formBuilder: FormBuilder, public snackBar: MatSnackBar,
              public router: Router,public appService: AppService,private activatedRoute: ActivatedRoute) {
  }

  ngOnInit() {
      this.sub = this.activatedRoute.params.subscribe(params => {
          this.token = params.token;
      });
    this.passwordForm = this.formBuilder.group({
      'newPassword': ['', Validators.required],
      'confirmNewPassword': ['', Validators.required]
    },{validator: matchingPasswords('newPassword', 'confirmNewPassword')});
  }

  public onPasswordFormSubmit(values:Object):void {
    if (this.passwordForm.valid && this.token) {
        this.appService.changePassword(this.token, values['newPassword'], "" , "",true).subscribe(data => {

            if (data.statusCode === 200) {
                    this.snackBar.open('Your password reset successfully! Login  to continue', '×', {
                        panelClass: 'success',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                    this.router.navigate(['/sign-in']);
                }else{
                    this.snackBar.open('Please try again', '×', {
                        panelClass: 'error',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                }
            }
        )
    }
  }

}

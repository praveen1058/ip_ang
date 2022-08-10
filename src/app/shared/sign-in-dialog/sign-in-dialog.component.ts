import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {  AppService } from '../../app.service';
import { AuthenticationService } from '../../authentication.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog,MatSnackBar } from '@angular/material';
import { emailValidator } from '../../theme/utils/app-validators';
import {ForgotPasswordComponent} from '../../shared/forgot-password/forgot-password.component';

@Component({
  selector: 'app-sign-in-dialog',
  templateUrl: './sign-in-dialog.component.html',
  styleUrls: ['./sign-in-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class SignInDialogComponent implements OnInit {
    loginForm: FormGroup;

    constructor(public formBuilder: FormBuilder, public router:Router, public snackBar: MatSnackBar,
                public authService:AuthenticationService,public dialog: MatDialog,
              public dialogRef: MatDialogRef<SignInDialogComponent>) { }

  ngOnInit() {
      this.loginForm = this.formBuilder.group({
          'email': ['', Validators.compose([Validators.required, emailValidator])],
          'password': ['', Validators.compose([Validators.required, Validators.minLength(6)])]
      });
  }

    public onLoginFormSubmit(values:Object):void {
        if (this.loginForm.valid) {
            this.authService.login(values['email'], values['password']).then(resolve => {
                if (resolve) {
                    this.dialogRef.close();
                    this.snackBar.open('User login to account successfully', '×', {
                        panelClass: 'success',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                } else {
                    this.snackBar.open('Incorrect login id/pass', '×', {
                        panelClass: 'error',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                }
            });
        }
    }
    public Register():void {
        this.dialogRef.close();
        this.router.navigate(['/sign-in']);

    }

    public openDialog() {
        let dialogRef = this.dialog.open(ForgotPasswordComponent, {
            panelClass: 'app-forgot-password',
            direction: 'ltr'
        });
    }

  public close(): void {
    this.dialogRef.close();
  }
}
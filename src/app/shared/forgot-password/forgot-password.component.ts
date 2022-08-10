import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {  AppService } from '../../app.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { emailValidator } from '../../theme/utils/app-validators';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ForgotPasswordComponent implements OnInit {
    forgotForm: FormGroup;
    clicked: boolean;

    constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar,
                public appService: AppService, public dialogRef: MatDialogRef<ForgotPasswordComponent>) { }

  ngOnInit() {
      this.forgotForm = this.formBuilder.group({
          'email' : ['', Validators.compose([Validators.required, emailValidator])]
      });
      this.clicked = false;
  }

    public onSubmit(values: Object):void {
        if (this.forgotForm.valid) {
            this.clicked=true;
            this.appService.forgotPassword(values['email']).subscribe(data => {
                if (data.statusCode == 200) {
                    this.dialogRef.close();
                    this.snackBar.open('Check email to reset password', '×', {
                        panelClass: 'success',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                    this.clicked=false;
                }
                else {
                    this.snackBar.open('Email Id not found', '×', {
                        panelClass: 'error',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                    this.clicked= false;
                }
            });
        }
    }

  public close(): void {
    this.dialogRef.close();
  }
}
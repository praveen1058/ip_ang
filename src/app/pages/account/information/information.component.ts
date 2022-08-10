import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { emailValidator, matchingPasswords } from '../../../theme/utils/app-validators';
import {User} from "../../../app.models";
import { AuthenticationService } from '../../../authentication.service';
import {Router} from "@angular/router";

@Component({
  selector: 'app-information',
  templateUrl: './information.component.html',
  styleUrls: ['./information.component.scss']
})
export class InformationComponent implements OnInit {
  infoForm: FormGroup;
  passwordForm: FormGroup;
  public currentUser: User
  constructor(public formBuilder: FormBuilder, public snackBar: MatSnackBar,
              public authservice: AuthenticationService, public router: Router) {
      this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {

    this.passwordForm = this.formBuilder.group({
      // 'currentPassword': ['', Validators.required],
      'newPassword': ['', Validators.required],
      'confirmNewPassword': ['', Validators.required]
    },{validator: matchingPasswords('newPassword', 'confirmNewPassword')});
  }

  // public onInfoFormSubmit(values:Object):void {
  //   if (this.infoForm.valid) {
  //
  //   }
  // }

  public onPasswordFormSubmit(values:Object):void {
    if (this.passwordForm.valid) {
        this.authservice.changePassword('', values['newPassword']).then(resolve => {
                if(resolve){
                    this.snackBar.open('Your password has been changed successfully!', '×', {
                        panelClass: 'success',
                        verticalPosition: 'top',
                        duration: 3000
                    });

                    this.authservice.logout();
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

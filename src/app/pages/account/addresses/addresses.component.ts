import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AppService } from '../../../app.service';
import { AuthenticationService } from '../../../authentication.service';
import {User} from "../../../app.models";

@Component({
  selector: 'app-addresses',
  templateUrl: './addresses.component.html',
  styleUrls: ['./addresses.component.scss']
})
export class AddressesComponent implements OnInit {
  billingForm: FormGroup;
  // shippingForm: FormGroup;
  public currentUser:User;
  comType = [];
  jobDesc = [];
    states=[];
  country;
  constructor(public appService:AppService, public formBuilder: FormBuilder, public snackBar: MatSnackBar,
    public authservice:AuthenticationService) {
      this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.states = this.appService.getStates();
    this.comType = this.appService.getCompType();
    this.jobDesc = this.appService.getJobDesc();


    this.getUserDetail();
      this.billingForm = this.formBuilder.group({
          'firstName': [this.currentUser.customers_firstname, Validators.required],
          'lastName': [this.currentUser.customers_lastname, Validators.required],
          'company': this.currentUser.customers_company,
          'email': [this.currentUser.customers_email_address, Validators.required],
          'phone': [this.currentUser.customers_telephone, Validators.required],
          'country': [this.currentUser.customers_country, Validators.required],
          'city': [this.currentUser.customers_city, Validators.required],
          'state': [this.currentUser.customers_state, Validators.required],
          'zip': [this.currentUser.customers_postcode, Validators.required],
          'address1': [this.currentUser.customers_address_line1, Validators.required],
          'fax': this.currentUser.customers_fax,
          'com_type':  [this.currentUser.company_type, Validators.required],
          'job_desc': [this.currentUser.job_description, Validators.required]
      });
    // this.shippingForm = this.formBuilder.group({
    //   'firstName': ['', Validators.required],
    //   'lastName': ['', Validators.required],
    //   'middleName': '',
    //   'company': '',
    //   'email': ['', Validators.required],
    //   'phone': ['', Validators.required],
    //   'country': ['', Validators.required],
    //   'city': ['', Validators.required],
    //   'state': '',
    //   'zip': ['', Validators.required],
    //   'address': ['', Validators.required]
    // });
  }
public getUserDetail():void{
    this.authservice.getUserDetail().then(resolve => {
    }
    );
}
  public onBillingFormSubmit(values:Object):void {
    if (this.billingForm.valid) {
        this.authservice.updateProfile(values['firstName'],values['lastName'],values['email'],values['company'],
            values['com_type'],values['job_desc'],values['address1'],
            values['state'],values['zip'], values['city'], values['phone'], "" ).then(resolve => {
                if(resolve){
                    this.snackBar.open('Your account updated successfully!', '×', {
                        panelClass: 'success',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                }else{
                    this.snackBar.open('Please try again', '×', {
                        panelClass: 'error',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                }
            }
        )    }
  }

  // public onShippingFormSubmit(values:Object):void {
  //   if (this.shippingForm.valid) {
  //     this.snackBar.open('Your shipping address information updated successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
  //   }
  // }

}

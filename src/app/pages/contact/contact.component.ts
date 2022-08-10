import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { emailValidator } from '../../theme/utils/app-validators';
import { AppService } from  '../../app.service';
import {MatSnackBar} from '@angular/material';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss']
})
export class ContactComponent implements OnInit {
  contactForm: FormGroup;

  constructor(public formBuilder: FormBuilder, public appService: AppService, public snackBar: MatSnackBar) { }

  ngOnInit() {
    this.contactForm = this.formBuilder.group({
      name: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, emailValidator])],
      phone: ['', Validators.required],
      message: ['', Validators.required]
    });
  }

  public onContactFormSubmit(values: Object) : void {
    if (this.contactForm.valid) {
        this.appService.addContact(values["name"],values["email"],values["phone"],values["message"]).subscribe(data => {
            this.snackBar.open('Contact Saved successfully', '×', {
                panelClass: 'success',
                verticalPosition: 'top',
                duration: 3000
            });
            this.contactForm.reset();
        });
    }
  }

}

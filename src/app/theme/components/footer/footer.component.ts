import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import { AppService } from  '../../../app.service';
import {MatSnackBar} from '@angular/material';
import { emailValidator } from '../../utils/app-validators';


@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html',
    styleUrls: ['./footer.component.scss']
})
export class FooterComponent implements OnInit {
    public lat: number = 40.678178;
    public lng: number = -73.944158;
    public zoom: number = 12;
    subscribeForm: FormGroup;
    enable : boolean = false;

    constructor(public formBuilder: FormBuilder, public appService: AppService, public snackBar: MatSnackBar) { }

    ngOnInit() {
        this.subscribeForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, emailValidator])],
        });
    }

    public onSubmit(values:Object):void {
        if (this.subscribeForm.valid) {

            this.appService.addSubscribe(values["email"]).subscribe(data => {
                this.snackBar.open('Thankyou for subscribing to indiapicture.in .', '×', {
                    panelClass: 'success',
                    verticalPosition: 'top',
                    duration: 3000
                });
                this.subscribeForm.reset();
            });
        }else{
            this.enable = true;
        }
    }

    subscribe() {
    }

}
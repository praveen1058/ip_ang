import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import {  AppService } from '../../app.service';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatSnackBar } from '@angular/material';
import { emailValidator } from '../../theme/utils/app-validators';
import {Results} from '../../app.models';

@Component({
  selector: 'app-share-dialog',
  templateUrl: './share-dialog.component.html',
  styleUrls: ['./share-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ShareDialogComponent implements OnInit {
    shareForm: FormGroup;
    clicked: boolean;

    constructor(public formBuilder: FormBuilder, public router: Router, public snackBar: MatSnackBar,
                public appService: AppService,
                @Inject(MAT_DIALOG_DATA) public wish: any, public dialogRef: MatDialogRef<ShareDialogComponent>) { }

  ngOnInit() {
      this.shareForm = this.formBuilder.group({
          'email' : ['', Validators.compose([Validators.required, emailValidator])]
      });
      this.clicked = false;
  }

    public onSubmit(values: Object):void {
        if (this.shareForm.valid) {
            this.clicked=true;
            this.appService.shareLightbox(values['email'], this.wish.id).subscribe(data => {
                if (data.statusCode == 200) {
                    this.dialogRef.close();
                    this.snackBar.open('Your lightbox on indiapicture.in has been successfully shared', '×', {
                        panelClass: 'success',
                        verticalPosition: 'top',
                        duration: 3000
                    });
                    this.clicked=false;
                }
                else {
                    this.snackBar.open('There is some issue Share again', '×', {
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

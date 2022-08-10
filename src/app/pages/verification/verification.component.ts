import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import { AppService } from '../../app.service';
import {MatSnackBar} from "@angular/material";

@Component({
  selector: 'app-verification',
  templateUrl: './verification.component.html',
  styleUrls: ['./verification.component.scss']
})
export class VerificationComponent implements OnInit {

  constructor(public router: Router, public appService: AppService,  private activatedRoute: ActivatedRoute,
              private snackBar: MatSnackBar) { }
    private sub: any;
  private  token: string;
  ngOnInit() {
      this.sub = this.activatedRoute.params.subscribe(params => {
          this.token = params.token;
      });
  }

  public verify(): void {
    if (this.token) {
        this.appService.verification(this.token).subscribe(data => {
          if(data.statusCode==200) {
              this.snackBar.open('Thankyou for verifying your Email address. ' +
                  'Your account has been successfully registered with indiapicture.in.', '×', {
                  panelClass: 'success',
                  verticalPosition: 'top',
                  duration: 3000
              });
              this.router.navigateByUrl("/sign-in");
          }else{
              this.snackBar.open('Invalid link', '×', {
                  panelClass: 'error',
                  verticalPosition: 'top',
                  duration: 3000
              });
          }
        });
    } else {
        this.snackBar.open('Invalid request', '×', {
            panelClass: 'error',
            verticalPosition: 'top',
            duration: 3000
        });
    }

  }

}

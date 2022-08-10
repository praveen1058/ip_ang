import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NgxSpinnerService } from 'ngx-spinner';
import { Observable, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import {isUndefined} from 'util';
import { AuthenticationService } from './../../authentication.service';
import { AppService } from './../../app.service';
import {MatSnackBar} from '@angular/material';
import {Router} from '@angular/router';

@Injectable()
export class AppInterceptor implements HttpInterceptor {
    constructor( private spinner: NgxSpinnerService, private authenticationService: AuthenticationService,
                 public snackBar: MatSnackBar, public appservice: AppService, private router: Router) {}

  public requestcount = 0;

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        // console.log(req.url.indexOf(this.appservice.backendUrl));
console.log("in other");
        if (!(req.params.get('skipLoader') === 'true')) {
            this.spinner.show();
            this.requestcount++;
        }
        return next.handle(req).pipe(map((event: HttpEvent<any>) => {
            if (event instanceof HttpResponse) {
                this.requestcount--;
                if (this.requestcount <= 0) {
                    this.spinner.hide();
                    this.requestcount = 0;
                }
            }
            return event;
          }),
          catchError((error: HttpErrorResponse) => {
            const started = Date.now();
            const elapsed = Date.now() - started;
            this.requestcount--;
            if (this.requestcount === 0) {
                  this.spinner.hide();
              }
            console.log(`Request for ${req.urlWithParams} failed after ${elapsed} ms.`);
            if (error.status === 401) {
                console.log(error);
                this.snackBar.open('Unauthorize, Please relogin', '×', {
                    panelClass: 'error',
                    verticalPosition: 'top',
                    duration: 3000
                });
                if (error.error.error == 'Token is Expired') {
                    this.authenticationService.logout();
                }
                this.router.navigate(['/sign-in']);

            }
           // debugger;
            return throwError(error);
          })
        );

    }

    // private async handleAccess(request: HttpRequest<any>, next: HttpHandler):
    // Promise<HttpEvent<any>> {
    //     const token = this.authenticationService.getAccessToken;
    //     let changedRequest = request;
    //
    //     if (token && changedRequest.url.indexOf(this.appservice.backendUrl) > -1) {
    //         changedRequest = changedRequest.clone({
    //             setHeaders: {
    //                 Authorization: `Bearer ${token}`
    //             }
    //         });
    //     }
    //
    //     return next.handle(changedRequest).toPromise();
    // }
}

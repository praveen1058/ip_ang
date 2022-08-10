import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatDialog, MatSnackBar} from '@angular/material';
import {emailValidator, matchingPasswords} from '../../theme/utils/app-validators';
import {AuthenticationService} from '../../authentication.service';
import {AppService} from '../../app.service';
import {ForgotPasswordComponent} from '../../shared/forgot-password/forgot-password.component';
import {Auth} from '../../app.models';
declare let gtag_report_conversion: Function;

@Component({
    selector: 'app-sign-in',
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {
    loginForm: FormGroup;
    registerForm: FormGroup;
    captchaResponse: string;
    enable: boolean;
    isTokenValid: boolean;

    constructor(public formBuilder: FormBuilder, public router: Router,
                public snackBar: MatSnackBar, public authService: AuthenticationService, public appService: AppService,
                public dialog: MatDialog) {
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
    }

    @ViewChild('recaptcha', {static: true }) recaptchaElement: ElementRef;

    ngOnInit() {
        // this.addRecaptchaScript();
        this.isTokenValid = false;
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.compose([Validators.required, emailValidator])],
            password: ['', Validators.compose([Validators.required, Validators.minLength(6)])]
        });

        this.createForm();

    }


    //  renderReCaptch() {
    //     window['grecaptcha'].render(this.recaptchaElement.nativeElement, {
    //         sitekey : '6Ld2vOQUAAAAAHpUV8FyeS5c3bPRmq8--6tHCwKL',
    //         callback: (response) => {
    //             this.verifyCaptcha(response);
    //         }
    //     });
    // }

    async resolved(captchaResponse: string) {
        console.log(`Resolved response token: ${captchaResponse}`);
        await this.sendTokenToBackend(captchaResponse);
    }

    sendTokenToBackend(tok) {
        // calling the service and passing the token to the service
        this.appService.verifyCaptcha(tok).subscribe(
            data => {
                if (data.success) {
                    this.isTokenValid = true;
                }
            },
            err => {
                console.log(err);
            },
            () => {}
        );
    }


    // addRecaptchaScript() {
    //
    //     window['grecaptchaCallback'] = () => {
    //         this.renderReCaptch();
    //     };
    //
    //     (function(d, s, id, obj) {
    //         let js, fjs = d.getElementsByTagName(s)[0];
    //         if (d.getElementById(id)) { obj.renderReCaptch(); return; }
    //         js = d.createElement(s); js.id = id;
    //         js.src = 'https://www.google.com/recaptcha/api.js?onload=grecaptchaCallback&amp;render=explicit';
    //         fjs.parentNode.insertBefore(js, fjs);
    //     }(document, 'script', 'recaptcha-jssdk', this));
    //
    // }

    public createForm() {
        this.enable = false;
        this.registerForm = this.formBuilder.group({
            name: ['', Validators.compose([Validators.required, Validators.minLength(3)])],
            email: ['', Validators.compose([Validators.required, emailValidator])],
            phone: ['', Validators.compose([Validators.required])],
            password: ['', Validators.required],
            confirmPassword: ['', Validators.required],
            captchaResponse: ['', Validators.required]
        }, {validator: matchingPasswords('password', 'confirmPassword')});
    }
    public onLoginFormSubmit(values: Auth): void {
        if (this.loginForm.valid) {

            this.authService.login(values.email, values.password).then(resolve => {
                    if (resolve) {
                        this.snackBar.open('Login Successfully', '×', {
                            panelClass: 'success',
                            verticalPosition: 'top',
                            duration: 3000
                        });
                        this.router.navigateByUrl('/account/dashboard');
                    } else {
                        this.snackBar.open('Incorrect Login ID/ Password', '×', {
                            panelClass: 'error',
                            verticalPosition: 'top',
                            duration: 3000
                        });
                    }
                }
            );
        }
    }

    public onRegisterFormSubmit(values: Auth): void {
        if (this.registerForm.valid && this.isTokenValid) {
            gtag_report_conversion();
            this.authService.register(values.name, values.email, values.phone, values.password).then(resolve => {
                    if (resolve) {
                        this.snackBar.open('You have successfully signed up. ' , '×', {
                            panelClass: 'success',
                            verticalPosition: 'top',
                            duration: 3000
                        });


                    } else {
                        this.snackBar.open('Email id already exist', '×', {
                            panelClass: 'error',
                            verticalPosition: 'top',
                            duration: 3000
                        });
                    }
                }
            );

            // this.snackBar.open('You registered successfully!', '×', { panelClass: 'success', verticalPosition: 'top', duration: 3000 });
        } else if (!this.isTokenValid) {
            const captchaResponseValidity = this.registerForm.controls.captchaResponse;
            return captchaResponseValidity.setErrors({invalidcaptcha: true});
        } else {
            this.enable = true;
        }
    }

    public openDialog() {
        const dialogRef = this.dialog.open(ForgotPasswordComponent, {
            panelClass: 'app-forgot-password',
            direction: 'ltr'
        });
    }

}

import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AppService} from '../../app.service';
import {AuthenticationService} from '../../authentication.service';
import {Category, Plan, User} from '../../app.models';
import {MatDialog, MatRadioChange, MatSnackBar, MatTabGroup} from '@angular/material';
import {SignInDialogComponent} from '../../shared/sign-in-dialog/sign-in-dialog.component';

@Component({
    selector: 'app-about',
    templateUrl: './plan.component.html',
    styleUrls: ['./plan.component.scss']
})
export class PlanComponent implements OnInit {

    constructor(public appService: AppService, public authService: AuthenticationService, public dialog: MatDialog, public snackBar: MatSnackBar) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
    }

    public planList: Array<Plan>;
    public categories: Category[];
    public sizes: any;
    public currentUser: User;
    public planId: any = {};
    public selectedIndex = 0;
    public slides = [];
    public singlePrice = {hd: 11500, '4k': 16500, large: 15000};
    // @ts-ignore
    @ViewChild(MatTabGroup) videoTabGroup: MatTabGroup;

    @ViewChild('form', {static: false}) form: ElementRef;
    accessCode: string;
    ccavenueUrl: string;
    encRequestRes: any;
    cashfreeUrl: any;

    showYearly = false;
    showDays = [30, 30, 30];


    ngOnInit() {
        this.getPlanDetail();
        this.getCategories();
        this.sizes = this.appService.getSizes();
        this.accessCode = this.appService.accessCode;
        this.ccavenueUrl = this.appService.ccavenueUrl;
        this.cashfreeUrl = this.appService.cashfreeUrl;
        this.getSlides();

    }

    public getCategories() {
        if (this.appService.Data.categories.length === 0) {
            this.appService.getCategories().subscribe(data => {
                this.categories = data;
                this.appService.Data.categories = data;

            });
        } else {
            this.categories = this.appService.Data.categories;
        }
    }

    public getPlanDetail() {
        this.appService.getPlanDetail().subscribe(data => {
            this.planList = data;

            // this.planId.small = this.planList.filter(item => (item.name == 'Small' && item.no_of_images > 1))[0].id;
            // this.planId.medium = this.planList.filter(item => (item.name == 'Medium' && item.no_of_images > 1))[0].id;
            this.planId.large = this.planList.filter(item => (item.name == 'Larger' && item.no_of_images > 1))[0].id;
            // this.planId.extra_large = this.planList.filter(item => (item.name == 'Extra Large' && item.no_of_images > 1))[0].id;
            this.planId.hd = this.planList.filter(item => (item.name == 'HD' && item.no_of_images > 1))[0].id;
            this.planId.four_k = this.planList.filter(item => (item.name == '4K' && item.no_of_images > 1))[0].id;
        });
    }

    public checkout(type: string) {
        const planId = this.getPlanId(type);
        console.log(planId);
        if (this.currentUser) {
            const redirectUrl = this.appService.ccAvenueResponseUrl + 'auth/handlerPlanresponse';
            const merchant = this.appService.merchant;
            const request = `merchant_id=${merchant}&currency=INR&redirect_url=${redirectUrl}&cancel_url=${redirectUrl}&language=EN`;
            this.appService.encryptPlandata(request, planId).subscribe(
                data => {
                    this.encRequestRes = data.response;
                    setTimeout(() => {
                        this.form.nativeElement.submit();
                    }, 1000);
                }, error => {
                    console.log(error);
                }
            );
        } else {
            this.snackBar.open('Please sign- in to Purchase.', '×', {
                panelClass: 'error',
                verticalPosition: 'top',
                duration: 3000
            });

            const dialogRef = this.dialog.open(SignInDialogComponent, {
                data: '',
                panelClass: 'app-sign-in-dialog',
                direction: 'ltr'
            });
        }
    }

    public checkoutCashfree(type: string) {
        const planId = this.getPlanId(type);
        console.log(planId);
        if (this.currentUser) {
            const redirectUrlCashfree = this.appService.cashfreeResponseUrl + 'auth/returnCashfreePlan';
            const merchant = this.appService.merchant;
            const request = `currency=INR&language=EN&redirect_url=${redirectUrlCashfree}`;
            this.appService.encryptPlandata(request, planId).subscribe(
                data => {
                    this.encRequestRes = data.response;
                    console.log(data.response);
                    setTimeout(() => {
                        this.form.nativeElement.submit();
                    }, 1000);
                }, error => {
                    console.log(error);
                }
            );
        } 
        else {
            this.snackBar.open('Please sign- in to Purchase.', '×', {
                panelClass: 'error',
                verticalPosition: 'top',
                duration: 3000
            });

            const dialogRef = this.dialog.open(SignInDialogComponent, {
                data: '',
                panelClass: 'app-sign-in-dialog',
                direction: 'ltr'
            });
        }
    }

    public changePlan($event: MatRadioChange, type: string) {
        // if (type == 'small') {
        //     this.planId.small = $event.value;
        // } else if (type == 'medium') {
        //     this.planId.medium = $event.value;
        // } else
        if (type == 'large') {
            this.planId.large = $event.value;
            // } else if (type == 'extra_large') {
            //     this.planId.extra_large = $event.value;
        } else if (type == 'hd') {
            this.planId.hd = $event.value;
        } else if (type == 'four_k') {
            this.planId.four_k = $event.value;
        }
    }

    public getPlanId(type: string) {
        // if (type == 'small') {
        //     return this.planId.small;
        // } else if (type == 'medium') {
        //     this.planId.medium;
        // }else if (type == 'extra_large') {
        //             return this.planId.extra_large;
        //         } else
        if (type == 'large') {
            return this.planId.large;
        } else if (type == 'hd') {
            return this.planId.hd;
        } else if (type == 'four_k') {
            return this.planId.four_k;
        }
    }

    public changeToggle($event, i) {
        console.log($event.value);
        this.showYearly = $event.checked;
        this.showDays[i] = $event.value == 'monthly' ? 30 : 360;
    }

    public getSlides() {
        this.appService.getSlides('plan-slider').subscribe(data => {
            this.slides = data;
        });
    }
}

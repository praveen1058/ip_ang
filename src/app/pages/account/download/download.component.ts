import {Component, OnInit} from '@angular/core';
import {AppService} from '../../../app.service';
import {AuthenticationService} from '../../../authentication.service';
import {CartData, User} from '../../../app.models';
import {ActivatedRoute, Router} from '@angular/router';
import {MatSnackBar} from '@angular/material';

@Component({
    selector: 'app-download',
    templateUrl: './download.component.html',
    styleUrls: ['./download.component.scss']
})
export class DownloadComponent implements OnInit {
    public currentUser: User;
    public orders: any[];
    public type: string;
    private sub: any;
    private cartProduct: CartData;

    constructor(public appService: AppService, public authService: AuthenticationService, private router: Router,
                private activatedRoute: ActivatedRoute, private snackBar: MatSnackBar) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
        this.router.routeReuseStrategy.shouldReuseRoute = function() {
            return false;
        };
    }

    ngOnInit() {
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.type = params.type;
        });
        this.appService.getOrdersSingle(this.currentUser.customers_id, this.type).subscribe(data => {
            this.orders = data;
        });
    }

    calculateDiff(orderDate) {
        const date = new Date(orderDate);
        const currentDate = new Date();

        const days = Math.floor((currentDate.getTime() - date.getTime()) / 1000 / 60 / 60 / 24);
        return days;
    }

    public reDownloadImage(id) {
        this.appService.reDownloadImage(id).subscribe(data => {
            if (data['data']) {
                console.log(data['data']);
                window.open(data['data'], '_blank');
            } else {
                this.snackBar.open('Problem in downloading image, Contact sales to reolve issue', '×', {
                    panelClass: 'error',
                    verticalPosition: 'top',
                    duration: 3000
                });
            }
        });
    }

    public downloadImage(order: any) {
        this.cartProduct = Object.assign({
            id: order.image_id,
            filename: order.filename,
            thumbnail: order.thumbnail,
            license: order.license,
            collection: order.collection,
            size: order.size,
            price: 0,
            type: order.type,
            caption: order.caption,
            category: order.category
        });
        this.appService.downloadImage(this.cartProduct, false).subscribe(data => {
            const url = data[0]['download_link'];
            const a = document.createElement('a');
            a.href = url;
            a.download = order.image_id + '';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            if (url != null) {
                order.download_link = data[0]['download_link'];
            }
        });

    }

    public downloadVideo(order: any) {
        this.cartProduct = Object.assign({
            id: order.image_id,
            filename: order.filename,
            thumbnail: order.thumbnail,
            license: order.license,
            collection: order.collection,
            size: order.size,
            price: 0,
            type: order.type,
            caption: order.caption,
            category: order.category
        });
        this.appService.downloadVideo(this.cartProduct, false).subscribe(data => {
            const url = data[0]['download_link'];
            const a = document.createElement('a');
            a.href = url;
            a.download = order.image_id + '';
            a.target = '_blank';
            document.body.appendChild(a);
            a.click();
            if (url != null) {
                order.download_link = data[0]['download_link'];
            }
        });

    }

}

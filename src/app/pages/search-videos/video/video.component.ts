import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AppService} from '../../../app.service';
import {CartData, Category, Results, Sizes, User, VideoFilter} from '../../../app.models';
import {AuthenticationService} from '../../../authentication.service';
import {SignInDialogComponent} from '../../../shared/sign-in-dialog/sign-in-dialog.component';
import {VideoPreviewComponent} from '../../../shared/video-listing/video-preview/video-preview.component';
import {SearchService} from '../../../search.service';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {
    public code: string = '';

    constructor(public appService: AppService, private activatedRoute: ActivatedRoute, private router: Router,
                public dialog: MatDialog, public authService: AuthenticationService,
                public snackBar: MatSnackBar,
                public searchService: SearchService) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
        this.durationFrom = 10;
        this.durationTo = 60;
        this.fpsFrom = 10;
        this.fpsTo = 25;
        this.priceFrom = 0;
        this.priceTo = 10000;
    }

    public filter = new VideoFilter('', '', '', '', '', '', [], '', '', '', '');
    public durationFrom: number;
    public durationTo: number;
    public fpsFrom: number;
    public fpsTo: number;
    public priceFrom: number;
    public priceTo: number;
    @ViewChild('zoomViewer', {static: true}) zoomViewer;
    public images: Results;
    public image: any;
    public zoomImage: any;
    private sub: any;
    public relatedVideos: Array<Results>;
    public categories: Category[];
    public currentUser: User;

    id: string;
    collection: string;
    collectionSize: Category;
    cartProduct: CartData;

    public categoryId: number;
    public isfetch = false;
    public btn: number;
    private fileUrl: string;

    ngOnInit() {
        this.filter.durationFrom = this.durationFrom + '';
        this.filter.durationTo = this.durationTo + '';
        this.filter.fpsFrom = this.fpsFrom + '';
        this.filter.fpsTo = this.fpsTo + '';
        this.filter.priceFrom = this.priceFrom + '';
        this.filter.priceTo = this.priceTo + '';
        const param = this.router.parseUrl(this.router.url);
        this.categoryId = param.queryParams.category === 'editorial' ? 4 : 2;
        this.btn = 0;
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            this.collection = params.collection;
            this.getCategories();
            this.getVideoById();
        });
        // this.searchService.setSearch( this.searchText);
        this.searchService.setCategory(this.categoryId);

    }

    // public getSubscriptionDetail() {
    //     if (this.currentUser) {
    //         this.appService.getSubscriptionDetail(this.categoryId == 1 ? 'creative' : 'editorial',
    //             this.images.collection, this.images.id, this.images.license).subscribe(data => {
    //             this.images.sizes.forEach(obj => {
    //                 const siz = data.filter(item => item.name == obj.name)[0];
    //                 obj.subscription = siz.subscription;
    //                 obj.download_link = siz.download_link;
    //                 obj.is_downloaded = siz.is_downloaded;
    //             });
    //
    //             this.changeSize(this.images.sizes[this.images.sizes.length - 1]);
    //         });
    //     }
    // }

    public getDownloadVideoDetail() {
        if (this.currentUser) {
            this.appService.getDownloadVideoDetail(this.categoryId == 2 ? 'creative' : 'editorial',
                this.images.collection, this.images.id, this.images.license).subscribe(data => {
                // console.log(data[0].price_high);
                this.images.sizes.forEach(obj => {
                    const siz = data.filter(item => item.name == obj.name)[0];
                    obj.subscription = this.images.collection == '211' ?
                        ((siz.price_high > 0 && obj.price_usd <= siz.price_high) ? siz.subscription : 0) : siz.subscription;
                    obj.download_link = siz.download_link;
                    obj.is_downloaded = siz.is_downloaded;
                });

                this.changeSize(this.images.sizes[this.images.sizes.length - 1]);
            });
        }
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

    public addToCart() {
        const product = this.cartProduct;
        if (this.currentUser) {
            const currentProduct = this.appService.Data.cartList.filter(item => item.id == product.id)[0];
            if (currentProduct) {
                this.snackBar.open('Video already exist in your cart', '×', {
                    panelClass: 'error',
                    verticalPosition: 'top',
                    duration: 5000
                });
                return false;
            } else {

                this.appService.addToCartListDB(JSON.stringify(product), this.currentUser.customers_id).subscribe(data => {
                    if (data.statusCode == 200) {
                        this.appService.addToCart(data.data.imagesArray, data.data.total_price, data.data.total_item);

                        this.snackBar.open('The video has been added to cart.', '×', {
                            panelClass: 'success',
                            verticalPosition: 'top',
                            duration: 3000
                        });
                    } else {
                        this.snackBar.open('Error in adding product to the cart', '×', {
                            panelClass: 'error',
                            verticalPosition: 'top',
                            duration: 3000
                        });
                    }
                });
            }

        } else {
            const dialogRef = this.dialog.open(SignInDialogComponent, {
                data: product,
                panelClass: 'app-sign-in-dialog',
                direction: 'ltr'
            });
        }
    }

    public getVideoById() {
        this.appService.getVideoById(this.id, this.collection).subscribe(data => {
            this.images = data;
            this.image = data.thumbnail;
            this.zoomImage = data.large_thumbnail;
            this.code = this.images.filename.substr(0, 4);
            // if (this.categoryId != null && this.categoryId == 4) {
            //     this.images.usage='Editorial';
            // }
            this.getDownloadVideoDetail();
            this.getRelatedVideos();

            this.cartProduct = Object.assign({
                id: data.id,
                filename: data.filename,
                thumbnail: data.thumbnail,
                license: data.license,
                collection: data.collection,
                size: data.sizes[data.sizes.length - 1].name,
                price: data.sizes[data.sizes.length - 1].price,
                type: 'Video',
                caption: data.caption,
                category: this.categoryId == 2 ? 'creative' : 'editorial'
            });
            // this.changeSize(this.images.sizes[this.images.sizes.length - 1]);

        });
    }

    public changeSize(size: Sizes) {

        this.collectionSize = this.appService.Data.categories.filter(item => item.id == parseInt(this.collection))[0];
        this.cartProduct.size = size.name;
        if (size.price != null && size.price > 0) {
            this.cartProduct.price = size.price;
        } else {
            this.cartProduct.price = this.collectionSize.creativePrice[size.name];
        }

        this.btn = size.is_downloaded ? 2 : (size.subscription > 0 ? 1 : 0);
    }

    public download(subscription: boolean) {
        this.appService.downloadVideo(this.cartProduct, subscription).subscribe(data => {
            const url = data[0].download_link;
            const a = document.createElement('a');
            a.href = url;
            a.download = this.images.id + '';
            // a.target = '_blank';
            document.body.appendChild(a);
            a.click();

            if (url != null) {
                this.images.sizes.filter(item => item.name == this.cartProduct.size)[0].download_link = data[0].download_link;
                this.btn = 2;
            }
        });
    }

    public getRelatedVideos() {
        this.relatedVideos = [];
        let customerId = '';
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            customerId = currentUser.customers_id;
        }

        if (this.categoryId != null && this.categoryId == 4) {
            this.appService.getVideos(this.images.caption, 40, 1, this.jsonToQueryString(this.filter), 'true', 1, customerId).subscribe(data => {
                this.relatedVideos = data.results.map((obj) => {
                    obj.category = 'editorial';
                    return obj;
                });
                this.isfetch = true;
            });
        } else {
            this.appService.getVideos(this.images.caption, 40, 1, this.jsonToQueryString(this.filter), 'true', 0, customerId).subscribe(data => {
                this.relatedVideos = data.results.map((obj) => {
                    obj.category = 'creative';
                    return obj;
                });
                this.isfetch = true;
            });
        }

    }

    public openDialog(video: any) {

        const dialogRef = this.dialog.open(VideoPreviewComponent, {
            data: video,
            panelClass: 'video-dialog',
            direction: 'ltr'
        });
        dialogRef.afterClosed().subscribe(video => {
            if (video) {
                this.router.navigate(['/video-detail', video.collection, video.id, video.caption]
                    , {queryParams: {category: video.category}});
            }
        });
    }

    public compDownload() {
        this.appService.compDownload(this.cartProduct).subscribe(data => {
            const url = data.download_link;
            window.open(url);
        });
    }


    public reDownloadImage(imageId, size) {
        this.appService.reDownloadImageById(imageId, size).subscribe(data => {
            if (data['data']) {
                console.log(data['data']);
                window.open(data['data'], '_blank');
            } else {
                this.snackBar.open('Problem in downloading videos, Contact sales to resolve issue', '×', {
                    panelClass: 'error',
                    verticalPosition: 'top',
                    duration: 3000
                });
            }
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    public jsonToQueryString(json) {
        return '&' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }

}

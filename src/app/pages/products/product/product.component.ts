import {Component, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatSnackBar} from '@angular/material';
import {AppService} from '../../../app.service';
import {CartData, Category, Results, Sizes, User} from '../../../app.models';
import {ProductPreviewComponent} from './product-preview/product-preview.component';
import {AuthenticationService} from '../../../authentication.service';
import {SignInDialogComponent} from '../../../shared/sign-in-dialog/sign-in-dialog.component';
import {SearchService} from '../../../search.service';

@Component({
    selector: 'app-product',
    templateUrl: './product.component.html',
    styleUrls: ['./product.component.scss']
})
export class ProductComponent implements OnInit {
    public code: string = "";

    constructor(public appService: AppService, private activatedRoute: ActivatedRoute, private router: Router,
                public dialog: MatDialog, public authService: AuthenticationService,
                public snackBar: MatSnackBar, public searchService: SearchService) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
    }

    @ViewChild('zoomViewer', {static: true}) zoomViewer;
    public images: Results;
    public wish: Results;
    public image: any;
    public zoomImage: any;
    private sub: any;
    public relatedProducts: Array<Results>;
    public categories: Category[];
    public currentUser: User;

    id: string;
    collection: string;
    collectionSize: Category;
    cartProduct: CartData;
    btn: number;
    disableBtn: boolean = false;

    public categoryId: number;
    public isfetch = false;
    public orderId;
    public editorial: Array<string> = ['210', '23', '208', '13', '132', '162', '168', '169', '170'];
    public usage = false;
    public partner = ['93', '210', '179', '130', '211', '172', '160', '124'];

    ngOnInit() {
        const param = this.router.parseUrl(this.router.url);
        this.categoryId = param.queryParams.category == 'editorial' ? 3 : 1;
        this.btn = 0;
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.id = params.id;
            this.collection = params.collection;
            this.getCategories();
            this.getImageById();
        });
        this.searchService.setCategory(this.categoryId);
        // const navigation = this.router.getCurrentNavigation();
        // this.orderId = navigation.extras.state ? navigation.extras.state.orderId : 0;
        // console.log(this.orderId+" order")


    }

    public getCategories() {
        if (this.appService.Data.categories.length == 0) {
            this.appService.getCategories().subscribe(data => {
                this.categories = data;
                this.appService.Data.categories = data;

            });
        } else {
            this.categories = this.appService.Data.categories;
        }
    }

    public download(isSubscription: boolean) {
        this.disableBtn = true;
        this.appService.downloadImage(this.cartProduct, isSubscription).subscribe(data => {
            this.disableBtn = false;
            const url = data[0].download_link;
            // const a = document.createElement('a');
            // a.href = url;
            // a.download = this.images.id + '';
            // a.target = '_blank';
            // document.body.appendChild(a);
            // a.click();
            window.open(url);
            if (url != null) {
                this.images.sizes.filter(item => item.name == this.cartProduct.size)[0].download_link = data[0].download_link;
                this.images.sizes.filter(item => item.name == this.cartProduct.size)[0].subscription = data[0].subscription;
                this.btn = 2;
            }
        });
    }

    public reDownloadImage(imageId, size) {
        this.appService.reDownloadImageById(imageId, size).subscribe(data => {
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

    public addToCart() {
        const product = this.cartProduct;
        if (this.currentUser && product.price > 0) {
            let currentProduct = this.appService.Data.cartList.filter(item => item.id == product.id)[0];
            if (product.collection == '93') {
                currentProduct = this.appService.Data.cartList.filter(item => item.id + '' == product.filename.replace('ALMY_', ''))[0];
            }

            if (currentProduct) {
                this.snackBar.open('Image already exist in your cart', '×', {
                    panelClass: 'error',
                    verticalPosition: 'top',
                    duration: 5000
                });
                return false;
            } else {

                this.appService.addToCartListDB(JSON.stringify(product), this.currentUser.customers_id).subscribe(data => {
                    if (data.statusCode === 200) {
                        this.appService.addToCart(data.data.imagesArray, data.data.total_price, data.data.total_item);

                        this.snackBar.open('The image has been added to cart.', '×', {
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
            this.snackBar.open('Please sign- in to Purchase.', '×', {
                panelClass: 'error',
                verticalPosition: 'top',
                duration: 3000
            });
            const dialogRef = this.dialog.open(SignInDialogComponent, {
                data: product,
                panelClass: 'app-sign-in-dialog',
                direction: 'ltr'
            });
        }
    }

    public getImageById() {
        this.appService.getImageById(this.id, this.collection).subscribe(data => {
            this.images = data;
            if (this.partner.filter(item => item == this.collection).length > 0) {
                this.code = this.images.filename.substr(0, 4);
            } else {
                this.code = this.images.author;
            }
            this.image = data.thumbnail;
            this.zoomImage = data.preview;
            const vect = this.images.sizes.filter(item => item.name == 'Vector');
            if (vect.length > 0 && this.images.sizes.length >= 2) {
                this.images.sizes.splice(0, this.images.sizes.length - 2);
            } else {
                this.images.sizes.splice(0, this.images.sizes.length - 1);
            }
            if (this.editorial.indexOf(this.collection) > -1) {
                this.usage = true;
            } else if (this.collection == '179') {
                this.usage = data.iseditorial;
            }
            this.getSubscriptionDetail();

            this.getRelatedProducts();

            this.cartProduct = Object.assign({
                id: data.id,
                filename: data.filename,
                thumbnail: data.thumbnail,
                license: data.license,
                collection: data.collection,
                size: data.sizes[data.sizes.length - 1].name,
                price: 0,
                type: 'Image',
                caption: data.caption,
                category: this.categoryId == 1 ? 'creative' : 'editorial'
            });

            this.wish = Object.assign({}, this.images);
            this.wish.id = this.images.filename.replace('ALMY_', '');
            this.wish.filename = this.images.id + '';


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
        console.log(size.subscription);
        this.btn = size.is_downloaded ? 2 : (size.subscription > 0 ? 1 : 0);

    }

    public getSubscriptionDetail() {
        if (this.currentUser) {
            this.appService.getSubscriptionDetail(this.categoryId == 1 ? 'creative' : 'editorial',
                this.images.collection, this.images.id, this.images.license).subscribe(data => {
                this.images.sizes.forEach(obj => {
                    const siz = data.filter(item => item.name == obj.name)[0];
                    obj.subscription = siz.subscription;
                    obj.download_link = siz.download_link;
                    obj.is_downloaded = siz.is_downloaded;
                });

                this.changeSize(this.images.sizes[this.images.sizes.length - 1]);
            });
        }
    }

    public getRelatedProducts() {
        this.relatedProducts = [];
        if (this.categoryId != null && this.categoryId == 3) {
            this.appService.getEditorialImages(this.images.caption, 10, 1, '&isRelated=1', 'true').subscribe(data => {
                // this.relatedProducts = data.results.map((result: any) =>
                // Object.assign({
                //     id: result.images_id,
                //     filename: result.images_filename,
                //     thumbnail: result.thumbnail_path,
                //     preview: result.preview_path,
                //     caption: result.images_caption,
                //     license: result.images_license_type,
                //     collection: result.images_collectionid,
                //     category: 'editorial',
                // }));
                this.relatedProducts = data.results.map((obj) => {
                    obj.category = 'editorial';
                    return obj;
                });
                this.isfetch = true;
            });

        } else {
            this.appService.getCreativeImages(this.images.caption, 10, 1, '&isRelated=1', 'true').subscribe(data => {
                this.relatedProducts = data.results.map((obj) => {
                    obj.category = 'creative';
                    return obj;
                });
                this.isfetch = true;
            });
        }

    }

    public openZoomViewer() {
        const dialogRef = this.dialog.open(ProductPreviewComponent, {
            data: this.images,
            panelClass: 'product-preview',
            direction: 'ltr'
        });
        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.router.navigate(['/detail', product.collection, product.collection == 93 ? product.filename : product.id]);
            }
        });
    }

    public compDownload() {
        this.appService.compDownload(this.cartProduct).subscribe(data => {
            const url = data.download_link;
            window.open(url);
        });
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

}

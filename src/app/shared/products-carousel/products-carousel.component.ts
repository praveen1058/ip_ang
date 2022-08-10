import {Component, OnInit, Input} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ProductDialogComponent} from './product-dialog/product-dialog.component';
import {AppService} from '../../app.service';
import {Category,Product, Results} from "../../app.models";
import {Settings, AppSettings} from 'src/app/app.settings';
import {VideoPreviewComponent} from './../video-listing/video-preview/video-preview.component';

@Component({
    selector: 'app-products-carousel',
    templateUrl: './products-carousel.component.html',
    styleUrls: ['./products-carousel.component.scss']
})
export class ProductsCarouselComponent implements OnInit {
    @Input('results') results: Array<Results> = [];
    // @Input('products') products: Array<Product> = [];
    public categories:Category[];
    public settings: Settings;
    public isHovering: string = "0";

    constructor(public appSettings: AppSettings, public appService: AppService, public dialog: MatDialog, private router: Router) {
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        this.getCategories();
    }

    hoverVideo(index) {
        this.isHovering = this.results[index].id + '';
        this.results[index].isHover = true;
    }


    hover(id) {
        this.isHovering = id;
    }


    public getCategories() {
        if (this.appService.Data.categories.length == 0) {
            this.appService.getCategories().subscribe(data => {
                this.categories = data;
                this.appService.Data.categories = data;
            });
        }
        else {
            this.categories = this.appService.Data.categories;
        }
    }

    // public showDetail(image:Results)
    // {
    //     this.router.navigate(['/detail', image.collection, image.collection == '93' ? image.filename : image.id, image.caption]
    //         , { queryParams: { category: image.category}});
    // }

    public openDialog(product) {
        let dialogRef = this.dialog.open(ProductDialogComponent, {
            data: product,
            panelClass: 'product-dialog',
            direction: (this.settings.rtl) ? 'rtl' : 'ltr'
        });
        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.router.navigate(['/detail', product.collection, product.collection == 93 ? product.filename : product.id,  product.caption]
                    , { queryParams: { category: product.category }});
            }
        });
    }

    public openVideoDialog(video) {
        let dialogRef = this.dialog.open(VideoPreviewComponent, {
            data: video,
            panelClass: 'video-dialog',
            direction: (this.settings.rtl) ? 'rtl' : 'ltr'
        });
        dialogRef.afterClosed().subscribe(video => {
            if (video) {
                this.router.navigate(['/video-detail', video.collection, video.id,  video.caption]
                    , { queryParams: { category: video.category }});
            }
        });
    }

}
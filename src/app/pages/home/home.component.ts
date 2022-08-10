import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {Product, Results} from '../../app.models';
import { SearchService } from '../../search.service';

@Component({
    selector: 'app-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    // public brands = [];
    public banners = [];
    public videoBanners=[];
    public creativeImages: Array<Results>;
    public editorialImages: Array<Results>;
    public videos: Array<Results>;
    public newArrivalsProducts: Array<Results>;
    public config: any;

    public slides = [];

    constructor(public appService: AppService, public searchService: SearchService) {
    }

    ngOnInit() {
        // this.getConfig();
        this.getSlides();
        this.getBanners();
        this.searchService.setSearch( "");
        this.searchService.setCategory(1);
        // this.getProducts("creative images");
    }


    // public onLinkClick(e) {
    //     this.getProducts(e.tab.textLabel.toLowerCase());
    // }

    // public getProducts(type) {
    //     if (type === 'creative images') {
    //         this.appService.getCreativeImages(this.config.homeCreative, this.config.count, 1, '', 'false').subscribe(data => {
    //             this.creativeImages = data.results.map((obj) => {
    //                 obj.category = 'creative';
    //                 return obj;
    //             });
    //         });
    //     }
    // }

    public getBanners() {
        this.appService.getBanners('creative').subscribe(data=>{
            this.banners = data;
        });
        this.appService.getBanners('video').subscribe(data=>{
            this.videoBanners = data;
        });
    }

    // public getConfig() {
    //     this.appService.getConfig().subscribe(data => {
    //         this.config = data;
    //         this.getProducts('creative images');
    //     });
    // }

    // public getBrands() {
    //     this.brands = this.appService.getBrands();
    // }

    public getSlides() {
        this.appService.getSlides('home-slider').subscribe(data => {
            this.slides = data;
        });
    }

}

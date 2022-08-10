import {Component, OnInit} from '@angular/core';
import {AppService} from '../../app.service';
import {SearchService} from '../../search.service';
import {Results, VideoFilter} from '../../app.models';
import {AuthenticationService} from '../../authentication.service';

@Component({
    selector: 'app-video',
    templateUrl: './video.component.html',
    styleUrls: ['./video.component.scss']
})
export class VideoComponent implements OnInit {

    // public brands = [];
    public banners = [];
    public videos: Array<Results>;
    public config: any;
    public filter = new VideoFilter('', '', '', '', '', '', [], '', '', '','');
    public slides = [];

    constructor(public appService: AppService, public authService: AuthenticationService, public searchService: SearchService) {
        this.durationFrom = 10;
        this.durationTo = 60;
        this.fpsFrom = 10;
        this.fpsTo = 25;
        this.priceFrom = 0;
        this.priceTo = 10000;
    }

    public durationFrom: number;
    public durationTo: number;
    public fpsFrom: number;
    public fpsTo: number;
    public priceFrom: number;
    public priceTo: number;

    ngOnInit() {
        this.filter.durationFrom = this.durationFrom + '';
        this.filter.durationTo = this.durationTo + '';
        this.filter.fpsFrom = this.fpsFrom + '';
        this.filter.fpsTo = this.fpsTo + '';
        this.filter.priceFrom = this.priceFrom + '';
        this.filter.priceTo = this.priceTo + '';

        this.getConfig();
        this.getSlides();
        this.getBanners();
        this.searchService.setCategory(2);
    }

    public getBanners() {
        this.appService.getBanners('video').subscribe(data => {
            this.banners = data;
        });
    }

    public getConfig() {
        this.appService.getConfig().subscribe(data => {
            this.config = data;
            console.log(this.config);
            this.getProducts();
        });
    }

    public getSlides() {
        this.appService.getSlides('video-slider').subscribe(data => {
            this.slides = data;
        });
    }

    public getProducts() {
        console.log(this.config.count);
        let customerId = '';
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            customerId = currentUser.customers_id;
        }
        this.appService.getVideos(this.config.homeCreative, this.config.count, 1, this.jsonToQueryString(this.filter), 'true', 0, customerId).subscribe(data => {
            this.videos = data.results.map((obj) => {
                obj.category = 'creative';
                return obj;
            });
        });
    }

    public jsonToQueryString(json) {
        return '&' +
            Object.keys(json).map(function(key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
    }
}

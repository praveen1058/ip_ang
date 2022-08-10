import {Component, ElementRef, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatRadioChange} from '@angular/material';
import {AppService} from '../../app.service';
import {Category, Product, Results, VideoFilter} from '../../app.models';
import {AppSettings, Settings} from 'src/app/app.settings';
import {NavbarService} from '../../navbar.service';
import {SearchService} from '../../search.service';
import {VideoPreviewComponent} from '../../shared/video-listing/video-preview/video-preview.component';
import {SpellCheckerService} from 'ngx-spellchecker';
import {HttpClient} from '@angular/common/http';
import {AuthenticationService} from '../../authentication.service';
import {Location} from '@angular/common';

@Component({
    selector: 'app-search-video',
    templateUrl: './search-videos.component.html',
    styleUrls: ['./search-videos.component.scss']
})
export class SearchVideosComponent implements OnInit {

    public durationFrom: number;
    public durationTo: number;
    public fpsFrom: number;
    public fpsTo: number;
    public priceFrom: number;
    public priceTo: number;

    @Input('searchText') searchText: string;
    @Input('category') categoryId: number;
    @ViewChild('sidenav', {static: true}) sidenav: any;

    public sidenavOpen = true;
    private sub: any;
    private type = 1;
    public viewType = 'grid';
    public viewCol = 25;
    public counts = [40, 80, 100];
    public count: any;
    public sortings = [
        {name: 'Most Relevant', selected: true}
    ];
    public peoples = [
        {value: '', name: 'Any', checked: true},
        {value: 0, name: 'No People', checked: false},
        {value: 1, name: '1 People', checked: false},
        {value: 2, name: '2 People', checked: false},
        {value: 3, name: '3 or more People', checked: false}
    ];
    public gender = [
        {value: '', name: 'Both', checked: true},
        {value: 1, name: 'Male', checked: false},
        {value: 2, name: 'Female', checked: false}
    ];
    public products: Array<Product> = [];
    public results: Array<Results> = [];
    public categories: Category[];
    // public searchCollection: Array<any> = [];
    public total = 0;
    public exist = true;
    public resolution_type = [
        {name: 'HD', selected: false},
        {name: '4K', selected: false}
    ];

    public page: 0;
    public isHovering = '0';
    public settings: Settings;

    public filter = new VideoFilter('', '', '', '', '', '', [], '', '', '', '');
    fileURL = 'https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic';
    public suggestedWords: Array<string> = [];
    public timeString: string;
    public timeStringTo: string;

    public dateObj: any;
    public dateObj1: any;

    hover(index) {
        this.isHovering = this.results[index].id + '';
        this.results[index].isHover = true;
    }

    play(video: ElementRef) {
        video.nativeElement.play();
    }

    constructor(public appSettings: AppSettings,
                private activatedRoute: ActivatedRoute,
                public appService: AppService,
                public authService: AuthenticationService,
                public dialog: MatDialog,
                private router: Router,
                public nav: NavbarService,
                public searchService: SearchService,
                public spellCheckerService: SpellCheckerService,
                public httpClient: HttpClient,
                private location: Location) {
        this.settings = this.appSettings.settings;
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };
        this.durationFrom = 0;
        this.durationTo = 120;
        this.fpsFrom = 0;
        this.fpsTo = 60;
        this.priceFrom = 0;
        this.priceTo = 10000;
    }

    ngOnInit() {
        this.nav.setSidenav(this.sidenav);
        this.count = this.counts[1];
        this.filter.durationFrom = this.durationFrom + '';
        this.filter.durationTo = this.durationTo + '';
        this.filter.fpsFrom = this.fpsFrom + '';
        this.filter.fpsTo = this.fpsTo + '';
        this.filter.priceFrom = this.priceFrom + '';
        this.filter.priceTo = this.priceTo + '';
        this.filter.sort = this.sortings[0].name;

        this.timeString = '00:30';
        this.timeStringTo = '01:00';

        this.sub = this.activatedRoute.params.subscribe(params => {
            this.searchText = params.name;
            this.categoryId = params.category;
            console.log(this.categoryId);

        });
        this.searchService.setSearch(this.searchText);
        this.searchService.setCategory(this.categoryId);
        this.convertQueryStringToObject();

        if (window.innerWidth < 960) {
            this.sidenavOpen = false;
        }

        if (window.innerWidth < 1280) {
            this.viewCol = 33.3;
        }

        this.getAllVideos();
        this.getCategories();
        // this.getSearchCollection();

    }

    public getAllVideos() {
        this.filter.advsearchtxt = this.searchText;
        this.searchService.setFilterVideo(this.filter);
        const q = this.createQueryString();
        const url = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: q}).toString();
        this.location.go(url);

        if (this.searchText != '') {

            let customerId = '';
            const currentUser = this.authService.currentUserValue;
            if (currentUser) {
                customerId = currentUser.customers_id;
            }

            if (this.categoryId != null && this.categoryId == 4) {
                this.appService.getVideos(this.searchText, this.count, this.page ? this.page : 1, this.jsonToQueryString(this.filter), 'false', 1, customerId).subscribe(data => {
                    this.results = data.results.map((obj) => {
                        obj.category = 'editorial';
                        obj.isHover = false;
                        return obj;
                    });
                    this.total = data.total;
                    this.exist = this.total > 0 ? true : false;
                });
            } else {
                this.appService.getVideos(this.searchText, this.count, this.page ? this.page : 1, this.jsonToQueryString(this.filter), 'false', 0, customerId).subscribe(data => {
                    this.results = data.results.map((obj) => {
                        obj.category = 'creative';
                        obj.isHover = false;
                        return obj;
                    });
                    this.total = data.total;
                    this.exist = this.total > 0 ? true : false;
                });
            }
            this.getArrayOfSuggestedKeyword(this.searchText);
        }
    }


    public jsonToQueryString(json) {
        return '&' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');
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


    // public getSearchCollection() {
    //     this.appService.getSearchCollection('creative').subscribe(data => {
    //         this.searchCollection = data;
    //     });
    // }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
        (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
    }

    public changeCount(count) {
        this.count = count;
        this.getAllVideos();
    }

    public changeResolution() {
        this.filter.resolution = this.resolution_type.filter(item => item.selected).map(item => item.name);
        this.getAllVideos();
    }

    //
    // public changeOrientation($event: MatRadioChange) {
    //     console.log($event.value);
    //     this.filter.orientation = $event.value;
    //     this.getAllVideos();
    // }
    //
    // public changeImageType($event: MatRadioChange) {
    //     console.log($event.value);
    //     this.filter.imageType = $event.value;
    //     this.getAllVideos();
    // }
    //
    public changePeople($event: MatRadioChange) {
        // console.log($event.value);
        this.filter.people = $event.value;
        this.getAllVideos();
    }

    public changeGender($event: MatRadioChange) {
        this.filter.gender = $event.value;
        this.getAllVideos();
    }

    public changeDuration(value: number, type: string) {
        if (type == 'low') {
            this.filter.durationFrom = value + '';
            this.dateObj = new Date(this.durationFrom * 1000);

            this.timeString = this.dateObj.getUTCMinutes().toString().padStart(2, '0')
                + ':' + this.dateObj.getSeconds().toString().padStart(2, '0');
            // this.getAllVideos();
        } else {
            this.filter.durationTo = value + '';
            let dateObj1: any;
            this.dateObj1 = new Date(this.durationTo * 1000);

            this.timeStringTo = this.dateObj1.getUTCMinutes().toString().padStart(2, '0')
                + ':' + this.dateObj1.getSeconds().toString().padStart(2, '0');
            // this.getAllVideos();
        }


    }

    public changePrice(value: number, type: string) {
        if (type == 'low') {
            this.filter.priceFrom = value + '';
        } else {
            this.filter.priceTo = value + '';
        }

    }

    public changeFps(value: number, type: string) {
        if (type == 'low') {
            this.filter.fpsFrom = value + '';
        } else {
            this.filter.fpsTo = value + '';
        }
    }

    public changeSorting() {
        this.filter.sort = this.sortings.filter(item => item.selected).map(item => item.name)[0];
    }

    public changeViewType(viewType, viewCol) {
        this.viewType = viewType;
        this.viewCol = viewCol;

    }

    public openDialog(video) {
        // this.lightbox.open(this.album, index, { wrapAround: true, showImageNumberLabel: true });
        const dialogRef = this.dialog.open(VideoPreviewComponent, {
            data: video,
            panelClass: 'video-dialog',
            direction: (this.settings.rtl) ? 'rtl' : 'ltr'
        });
        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                this.router.navigate(['/detail', product.collection, product.collection == 93 ? product.filename : product.id, product.caption]
                    , {queryParams: {category: product.category}});
            }
        });
    }

    public onPageChanged(event) {
        this.page = event;
        this.getAllVideos();
        window.scrollTo(0, 0);
    }

    public getArrayOfSuggestedKeyword(word) {
        this.httpClient.get(this.fileURL, {responseType: 'text'}).subscribe((res: any) => {
            this.suggestedWords = [];

            this.spellCheckerService.normalizeDictionary(res).then((dic) => {

                const dictionary = this.spellCheckerService.getDictionary(dic);
                const splitted = word.split(' ', 3);
                let str = '';
                let misspell = false;
                if (splitted.length > 1) {
                    for (const wordcheck of splitted) {
                        const checkRes = dictionary.checkAndSuggest(wordcheck, 5);
                        if (checkRes.misspelled) {
                            str += checkRes.suggestions[0] + ' ';
                            misspell = true;
                        } else {
                            str += wordcheck + ' ';
                        }
                    }
                    if (misspell) {
                        this.suggestedWords = [str.trim()];
                    }
                } else {
                    const checkRes = dictionary.checkAndSuggest(word, 5);
                    if (checkRes.misspelled) {
                        this.suggestedWords = checkRes.suggestions;
                    }
                }
            });

        });
    }


    getName(name: string) {
        if (name == 'people') {
            return this.peoples.find(x => x.value == this.filter.people).name;
        }
        if (name == 'gender') {
            return this.gender.find(x => x.value == this.filter.gender).name;
        }
    }

    removeFilter(name: string) {
        if (name == 'people') {
            this.filter.people = '';
        }
        if (name == 'gender') {
            this.filter.gender = '';
        }
        if (name == 'fps') {
            this.filter.fpsFrom = 0 + '';
            this.fpsFrom = 0;
            this.filter.fpsTo = 60 + '';
            this.fpsTo = 60;
        }
        if (name == 'duration') {
            this.filter.durationFrom = 0 + '';
            this.durationFrom = 0;
            this.filter.durationTo = 120 + '';
            this.durationTo = 120;
        }
        this.getAllVideos();
    }

    removeResolution(name: string, type: string) {
        const index = this.resolution_type.findIndex((obj => obj.name == type));
        this.resolution_type[index].selected = false;

        this.filter.resolution = this.resolution_type.filter(item => item.selected).map(item => item.name);
        this.getAllVideos();
    }


    clearAll() {
        this.filter = new VideoFilter('', '', '', '', '', '', [], '', '', '','');

        this.filter.sort = this.sortings[0].name;
        this.resolution_type[0].selected = false;
        this.resolution_type[1].selected = false;

        this.filter.fpsFrom = 10 + '';
        this.fpsFrom = 10;
        this.filter.fpsTo = 25 + '';
        this.fpsTo = 25;


        this.filter.durationFrom = 10 + '';
        this.durationFrom = 10;
        this.filter.durationTo = 60 + '';
        this.durationTo = 60;

        this.filter.priceFrom = 0 + '';
        this.priceFrom = 0;
        this.filter.priceTo = 10000 + '';
        this.priceTo = 10000;

        this.getAllVideos();
    }

    createQueryString() {
        return {
            durationFrom: this.filter.durationFrom,
            durationTo: this.filter.durationTo,
            fpsFrom: this.filter.fpsFrom,
            fpsTo: this.filter.fpsTo,
            gender: this.filter.gender,
            people: this.filter.people,
            resolution: this.filter.resolution.toString(),
            sort: this.filter.sort,
            priceFrom: this.filter.priceFrom,
            priceTo: this.filter.priceTo,
            advsearchtxt: this.filter.advsearchtxt,
        };
    }


    convertQueryStringToObject() {

        this.activatedRoute.queryParams.subscribe(params => {

            this.durationFrom = params.durationFrom;
            this.durationTo = params.durationTo;
            this.fpsFrom = params.fpsFrom;
            this.fpsTo = params.fpsTo;
            this.priceFrom = params.priceFrom;
            this.priceTo = params.priceTo;
            this.filter.durationFrom = params.durationFrom;
            this.filter.durationTo = params.durationTo;
            this.filter.fpsFrom = params.fpsFrom;
            this.filter.fpsTo = params.fpsTo;
            this.filter.gender = params.gender;
            this.filter.people = params.people;
            this.filter.resolution = params.resolution.split(','), this.filter.sort = params.sort;
            this.filter.priceFrom = params.priceFrom;
            this.filter.priceTo = params.priceTo;
            this.filter.advsearchtxt = params.advsearchtxt;

            this.resolution_type[0].selected = this.filter.resolution.includes('HD') ? true : false;
            this.resolution_type[1].selected = this.filter.resolution.includes('4K') ? true : false;
        });
    }
}

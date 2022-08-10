import {Component, ElementRef, HostListener, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog} from '@angular/material';
import {ProductDialogComponent} from '../../shared/products-carousel/product-dialog/product-dialog.component';
import {AppService} from '../../app.service';
import {Category, ContributorData, Filter, Product, Results, VideoFilter} from '../../app.models';
import {AppSettings, Settings} from 'src/app/app.settings';
import {NavbarService} from '../../navbar.service';
import {SearchService} from '../../search.service';
import {SpellCheckerService} from 'ngx-spellchecker';
import {HttpClient} from '@angular/common/http';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {AuthenticationService} from '../../authentication.service';

@Component({
    selector: 'app-contributor-profile',
    templateUrl: './contributor-profile.component.html',
    styleUrls: ['./contributor-profile.component.scss']
})
export class ContributorProfileComponent implements OnInit {
    public contributorData: ContributorData;
    public contributor_image_type: string = '';

    constructor(public appSettings: AppSettings,
                private activatedRoute: ActivatedRoute,
                public appService: AppService,
                public dialog: MatDialog,
                private router: Router,
                public nav: NavbarService,
                public searchService: SearchService,
                private spellCheckerService: SpellCheckerService,
                private httpClient: HttpClient,
                public formBuilder: FormBuilder,
                public authService: AuthenticationService) {
        this.settings = this.appSettings.settings;
        // tslint:disable-next-line:only-arrow-functions
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

    public searchText: string;
    public code: string;
    public categoryId: number;
    private sub: any;
    public imageToShowOnError = 'assets/images/black.png';
    public viewType = 'grid';
    public viewCol = 25;
    public counts = [40, 80, 100];
    public count: any;
    public sortings = [
        {name: 'Most Relevant', selected: true}
    ];
    public products: Array<Product> = [];
    public results: Array<Results> = [];
    public categories: Category[];
    public internaltionalCollid: Array<string> = [];
    public indianCollid: Array<string> = [];
    public total = 0;
    public exist = true;
    public license_type = [
        {name: 'RM', selected: false},
        {name: 'RF', selected: false}
    ];
    public type = 'image';

    public page: 0;
    public isHovering = '0';
    public settings: Settings;
    public placeholder = 'http://www.trtsecurity.co.za/wp-content/uploads/2016/07/person-placeholder.jpg';
    fileURL = 'https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic';
    public filter = new Filter([], '', '', '', '', '', '', '', [], '');
    public videoFilter = new VideoFilter('', '', '', '', '', '', [], '', '', '', '');

    public suggestedWords: Array<string> = [];
    public durationFrom: number;
    public durationTo: number;
    public fpsFrom: number;
    public fpsTo: number;
    public priceFrom: number;
    public priceTo: number;
    public collection: number;
    searchForm: FormGroup;
    public inpixColl = [218, 197, 21, 12, 24];

    ngOnInit() {
        this.count = this.counts[1];
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.collection = params.collection;
            this.code = params.code;
            if (this.inpixColl.filter(item => item == this.collection).length > 0) {
                this.code = 'INPIX';
            }
            this.categoryId = params.category;
            this.type = params.type;
            this.searchText = params.search;
        });


        this.videoFilter.durationFrom = this.durationFrom + '';
        this.videoFilter.durationTo = this.durationTo + '';
        this.videoFilter.fpsFrom = this.fpsFrom + '';
        this.videoFilter.fpsTo = this.fpsTo + '';
        this.videoFilter.priceFrom = this.priceFrom + '';
        this.videoFilter.priceTo = this.priceTo + '';

        this.searchForm = this.formBuilder.group({
            // searchText: [localStorage.getItem('searchText'), Validators.required]
            searchText: ['', Validators.required]
        });

        if (window.innerWidth < 1280) {
            this.viewCol = 33.3;
        }
        this.getContributorData();
        this.getCategories();
        if (this.type == 'video') {
            this.getAllVideos();
        } else {
            this.getAllImages();
        }
    }

    public getFileName(fileName: string) {
        if (fileName && fileName.toString().length > 0) {
            const [name] = fileName.toString().split('.');
            return name || '';
        } else {
            return '';
        }

    }

    private getContributorData() {
        this.appService.getContributorData(this.code, this.collection).subscribe(data => {
            if (data.length > 0) {
                this.contributorData = data[0];
            }
        }, err => {
            this.exist = false;
        });
    }

    public getAllImages() {

        /**
         * As discusssed With Sandeep same result for
         * creative and editorial in contributor profile
         * **/

        // if (this.categoryId != null && this.categoryId == 3) {
        //     // tslint:disable-next-line:max-line-length
        //     this.appService.getEditorialImages(this.searchText, this.count, this.page ? this.page : 1, this.jsonToQueryString(this.filter), 'false').subscribe(data => {
        //         this.results = data.results.map((obj) => {
        //             obj.category = 'editorial';
        //             return obj;
        //         });
        //         this.total = data.total;
        //         this.exist = this.total > 0 ? true : false;
        //     }, err => {
        //         this.exist = false;
        //     });
        // } else {
            // tslint:disable-next-line:max-line-length
            this.appService.getCreativeImages(this.searchText, this.count, this.page ? this.page : 1, this.jsonToQueryString(this.filter), 'false').subscribe(data => {
                this.results = data.results.map((obj) => {
                    obj.category = 'creative';
                    return obj;
                });
                this.total = data.total;
                this.exist = this.total > 0 ? true : false;
            }, err => {
                this.exist = false;
            });
        // }

        if (this.searchText != '') {
            this.getArrayOfSuggestedKeyword(this.searchText);
        }
    }

    public getAllVideos() {
        // this.filter.advsearchtxt = this.searchText;
        // this.searchService.setFilterVideo(this.filter);
        // const q = this.createQueryString();
        // const url = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: q}).toString();
        // this.location.go(url);

        let customerId = '';
        const currentUser = this.authService.currentUserValue;
        if (currentUser) {
            customerId = currentUser.customers_id;
        }

        if (this.categoryId != null && this.categoryId == 4) {
            // tslint:disable-next-line:max-line-length
            this.appService.getVideos(this.searchText, this.count, this.page ? this.page : 1, this.jsonToQueryString(this.videoFilter), 'false', 1, customerId).subscribe(data => {
                this.results = data.results.map((obj) => {
                    obj.category = 'editorial';
                    obj.isHover = false;
                    return obj;
                });
                this.total = data.total;
                this.exist = this.total > 0 ? true : false;
            });
        } else {
            // tslint:disable-next-line:max-line-length
            this.appService.getVideos(this.searchText, this.count, this.page ? this.page : 1, this.jsonToQueryString(this.videoFilter), 'false', 0, customerId).subscribe(data => {
                this.results = data.results.map((obj) => {
                    obj.category = 'creative';
                    obj.isHover = false;
                    return obj;
                });
                this.total = data.total;
                this.exist = this.total > 0 ? true : false;
            });
        }
        if (this.searchText != '') {
            this.getArrayOfSuggestedKeyword(this.searchText);
        }
    }

    public jsonToQueryString(json) {
        let val = '&' +
            Object.keys(json).map(function (key) {
                return encodeURIComponent(key) + '=' +
                    encodeURIComponent(json[key]);
            }).join('&');

        val += '&contributor_code=' + this.code + '&contributor_image_type=' + this.contributor_image_type;
        return val;
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

    public showDetail(image: Results) {
        this.router.navigate(['/detail', image.collection, image.collection == '93' ? image.filename : image.id, image.caption]
            , {queryParams: {category: image.category}});
    }

    ngOnDestroy() {
        this.sub.unsubscribe();
    }

    @HostListener('window:resize')
    public onWindowResize(): void {
        (window.innerWidth < 1280) ? this.viewCol = 33.3 : this.viewCol = 25;
    }

    public closeMenu() {

        if (JSON.stringify(this.filter.coll_id) === JSON.stringify(this.internaltionalCollid.concat(this.indianCollid))) {
            // No Changes, no need to refresh images.
        } else {
            this.filter.coll_id = this.internaltionalCollid.concat(this.indianCollid);
            this.getAllImages();
        }

    }

    public changeSorting() {
        this.filter.sort = this.sortings.filter(item => item.selected).map(item => item.name)[0];
        // this.getAllImages();
    }

    public openProductDialog(product1) {
        // this.lightbox.open(this.album, index, { wrapAround: true, showImageNumberLabel: true });
        const dialogRef = this.dialog.open(ProductDialogComponent, {
            data: product1,
            panelClass: 'product-dialog',
            direction: (this.settings.rtl) ? 'rtl' : 'ltr'
        });
        dialogRef.afterClosed().subscribe(product => {
            if (product) {
                // tslint:disable-next-line:max-line-length
                this.router.navigate(['/detail', product.collection, product.collection == 93 ? product.filename : product.id, product.caption]
                    , {queryParams: {category: product.category}});
            }
        });
    }

    public onPageChanged(event) {
        this.page = event;
        this.getAllImages();
        window.scrollTo(0, 0);
    }

    public getArrayOfSuggestedKeyword(word) {
        if (word) {
            this.httpClient.get(this.fileURL, {responseType: 'text'}).subscribe((res: any) => {
                this.suggestedWords = [];

                this.spellCheckerService.normalizeDictionary(res).then((dic) => {

                    const dictionary = this.spellCheckerService.getDictionary(dic);
                    const splitted = word.split(' ');
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
    }

    createQueryString() {
        return {
            license: this.filter.license.toString(),
            orientation: this.filter.orientation,
            imageType: this.filter.imageType,
            people: this.filter.people,
            gender: this.filter.gender,
            age: this.filter.age,
            ethnicity: this.filter.ethnicity,
            sort: this.filter.sort,
            coll_id: this.filter.coll_id.toString(),
            advsearchtxt: this.filter.advsearchtxt.toString()
        };
    }

    getCollectionName(collection) {
        const arr: Array<any> = [];
        // tslint:disable-next-line:prefer-for-of
        for (let i = 0; i < collection.length; i++) {
            const obj = {id: 0, name: ''};
            obj.id = collection[i];
            obj.name = this.appService.Data.categories.filter(item => item.id == obj.id)[0].name;
            arr.push(obj);
        }
        arr.sort((a, b) => a.name.localeCompare(b.name));
        return arr;
    }

    public onSubmit(values: any): void {
        if (this.searchForm.valid) {
            this.searchText = values.searchText;
            if (this.type == 'video') {
                this.getAllVideos();
            } else {
                this.getAllImages();
            }
        }

    }

    hover(index) {
        this.isHovering = this.results[index].id + '';
        this.results[index].isHover = true;
    }

    play(video: ElementRef) {
        video.nativeElement.play();
    }

    changeContributorImageType($type) {
        this.contributor_image_type = $type;
        this.getAllImages();

    }
}


import {Component, HostListener, Input, OnInit, ViewChild} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {MatDialog, MatRadioChange, MatSelect} from '@angular/material';
import {ProductDialogComponent} from '../../shared/products-carousel/product-dialog/product-dialog.component';
import {AppService} from '../../app.service';
import {Category, Filter, Product, Results} from '../../app.models';
import {AppSettings, Settings} from 'src/app/app.settings';
import {NavbarService} from '../../navbar.service';
import {SearchService} from '../../search.service';
import {SpellCheckerService} from 'ngx-spellchecker';
import {HttpClient} from '@angular/common/http';
import {Location} from '@angular/common';

@Component({
    selector: 'app-products',
    templateUrl: './products.component.html',
    styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

    constructor(public appSettings: AppSettings,
                private activatedRoute: ActivatedRoute,
                public appService: AppService,
                public dialog: MatDialog,
                private router: Router,
                public nav: NavbarService,
                public searchService: SearchService,
                private spellCheckerService: SpellCheckerService,
                private httpClient: HttpClient,
                private location: Location) {
        this.settings = this.appSettings.settings;
        // tslint:disable-next-line:only-arrow-functions
        this.router.routeReuseStrategy.shouldReuseRoute = function () {
            return false;
        };

    }

    @Input('searchText') searchText: string;
    @Input('category') categoryId: number;
    @ViewChild('sidenav', {static: true}) sidenav: any;
    @ViewChild('indianSelect', {static: false}) indianSelect: MatSelect;
    @ViewChild('internatinalSelect', {static: false}) internatinalSelect: MatSelect;
    public defaultImage = 'https://wtwp.com/wp-content/uploads/2015/06/placeholder-image.png';
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
    public products: Array<Product> = [];
    public results: Array<Results> = [];
    public categories: Category[];
    public searchInternationalCollection: Array<any> = [];
    public searchIndianCollection: Array<any> = [];
    public searchIndianCollectionName: Array<any> = [];
    public searchInternationalCollectionName: Array<any> = [];
    public internaltionalCollid: Array<string> = [];
    public indianCollid: Array<string> = [];
    public total = 0;
    public exist = true;
    public license_type = [
        {name: 'RM', selected: false},
        {name: 'RF', selected: false}
    ];
    public ages = [
        {value: '', name: 'All', checked: true},
        {value: 1, name: 'Baby', checked: false},
        {value: 2, name: 'Teenager', checked: false},
        {value: 3, name: 'Adult', checked: false},
        {value: 4, name: 'Senior', checked: false},
    ];
    public orientations = [
        {value: '', name: 'All', checked: true},
        {value: 1, name: 'Horizontal', checked: false},
        {value: 2, name: 'Vertical', checked: false}
    ];
    public imageTypes = [
        {value: '', name: 'Any', checked: true},
        {value: 1, name: 'Photo', checked: false},
        {value: 8, name: 'Vector', checked: false},
        {value: 2, name: 'Illustration', checked: false}
    ];
    public peoples = [
        {value: '', name: 'Any', checked: true},
        {value: 8, name: 'No People', checked: false},
        {value: 1, name: '1 People', checked: false},
        {value: 2, name: '2 People', checked: false},
        {value: 3, name: '3 People', checked: false},
        {value: 4, name: '4 People', checked: false},
        {value: 5, name: '5 People', checked: false},
    ];
    public gender = [
        {value: '', name: 'Both', checked: true},
        {value: 1, name: 'Male', checked: false},
        {value: 2, name: 'Female', checked: false}
    ];
    public ethinicity = [
        {value: '', name: 'Other', checked: true},
        {value: 1, name: 'Indian', checked: false}
    ];
    public page: 0;
    public isHovering = '0';
    public settings: Settings;
    fileURL = 'https://raw.githubusercontent.com/JacobSamro/ngx-spellchecker/master/dict/normalized_en-US.dic';
    // fileURL = 'https://raw.githubusercontent.com/dwyl/english-words/master/words_alpha.txt';
    public filter = new Filter([], '', '', '', '', '', '', '', [], '');
    public suggestedWords: Array<string> = [];
    public imageToShowOnError = 'assets/images/black.png';

    ngOnInit() {
        this.nav.setSidenav(this.sidenav);
        this.count = this.counts[1];
        this.sub = this.activatedRoute.params.subscribe(params => {
            this.searchText = params.name;
            this.categoryId = params.category;
        });
        this.convertQueryStringToObject();
        this.searchService.setSearch(this.searchText);
        this.searchService.setCategory(this.categoryId);


        if (window.innerWidth < 960) {
            this.sidenavOpen = false;
        }

        if (window.innerWidth < 1280) {
            this.viewCol = 33.3;
        }
        this.getCategories();
        this.getSearchCollection();


        this.filter.sort = this.sortings[0].name;
        this.getAllImages();
    }

    ngAfterViewInit() {
        const self = this;
        setTimeout(() => {
            this.indianSelect.value = this.indianCollid.map((i) => Number(i));
            this.internatinalSelect.value = this.internaltionalCollid.map((i) => Number(i));

            // this.indianCollid = this.indianSelect.value;
            // this.internaltionalCollid = this.internatinalSelect.value;
        }, 1);
    }

    public getFileName(fileName: string) {
        if (fileName && fileName.toString().length > 0) {
            const [name] = fileName.toString().split('.');
            return name || '';
        } else {
            return '';
        }

    }

    public getAllImages() {
        this.filter.advsearchtxt = this.searchText;
        this.searchService.setFilterImage(this.filter);
        const q = this.createQueryString();
        const url = this.router.createUrlTree([], {relativeTo: this.activatedRoute, queryParams: q}).toString();
        this.location.go(url);

        if (this.searchText != '') {
            // ||localStorage.getItem("searchText") != '') {
            if (this.categoryId != null && this.categoryId == 3) {
                // tslint:disable-next-line:max-line-length
                this.appService.getEditorialImages(this.searchText, this.count, this.page ? this.page : 1, this.jsonToQueryString(this.filter), 'false').subscribe(data => {
                    this.results = data.results.map((obj) => {
                        obj.category = 'editorial';
                        return obj;
                    });
                    // this.results = data.results.map((result: any) =>
                    //     Object.assign({
                    //         id: result.images_id ? result.images_id : result.id,
                    //         filename: result.images_filename ? result.images_filename : result.filename,
                    //         thumbnail: result.thumbnail_path ? result.thumbnail_path : result.thumbnail,
                    //         preview: result.preview_path ? result.preview_path : result.preview,
                    //         caption: result.images_caption ? result.images_caption : result.caption,
                    //         license: result.images_license_type ? result.images_license_type : result.license,
                    //         collection: result.images_collectionid ? result.images_collectionid : result.collection,
                    //         category: 'editorial'
                    //     }));

                    this.total = data.total;
                    this.exist = this.total > 0 ? true : false;
                }, err => {
                    this.exist = false;
                });
            } else {
                // console.log(this.jsonToQueryString(this.filter));
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
            }
            this.getArrayOfSuggestedKeyword(this.searchText);
        } else {
            this.exist = false;
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

    public showDetail(image: Results) {
        this.router.navigate(['/detail', image.collection, image.collection == '93' ? image.filename : image.id, image.caption]
            , {queryParams: {category: image.category}});
    }

    public getSearchCollection() {
        if (this.categoryId != null && this.categoryId == 3) {
            this.appService.getInternationalSearchCollection('editorial').subscribe(data => {
                this.searchInternationalCollection = data;
                this.searchInternationalCollectionName = this.getCollectionName(this.searchInternationalCollection);
                // tslint:disable-next-line:max-line-length
                this.internaltionalCollid = ((this.filter.coll_id.map((i) => Number(i))).filter(x => this.searchInternationalCollection.indexOf(x) > -1)).map((i) => String(i));
            });
            this.appService.getIndianSearchCollection('editorial').subscribe(data => {
                this.searchIndianCollection = data;
                this.searchIndianCollectionName = this.getCollectionName(this.searchIndianCollection);
                // tslint:disable-next-line:max-line-length
                this.indianCollid = ((this.filter.coll_id.map((i) => Number(i))).filter(x => this.searchIndianCollection.indexOf(x) > -1)).map((i) => String(i));
            });
        } else {
            this.appService.getInternationalSearchCollection('creative').subscribe(data => {
                this.searchInternationalCollection = data;
                this.searchInternationalCollectionName = this.getCollectionName(this.searchInternationalCollection);
                // tslint:disable-next-line:max-line-length
                this.internaltionalCollid = ((this.filter.coll_id.map((i) => Number(i))).filter(x => this.searchInternationalCollection.indexOf(x) > -1)).map((i) => String(i));
            });
            this.appService.getIndianSearchCollection('creative').subscribe(data => {
                this.searchIndianCollection = data;
                this.searchIndianCollectionName = this.getCollectionName(this.searchIndianCollection);
                // tslint:disable-next-line:max-line-length
                this.indianCollid = ((this.filter.coll_id.map((i) => Number(i))).filter(x => this.searchIndianCollection.indexOf(x) > -1)).map((i) => String(i));
            });
        }
    }

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
        this.getAllImages();
    }

    public changeLicense() {
        this.filter.license = this.license_type.filter(item => item.selected).map(item => item.name);
        this.getAllImages();
    }

    public changeInternationalSearchCollection($event: any) {
        this.internaltionalCollid = $event.value;
        // console.log(this.filter.coll_id);
        // this.filter.coll_id = this.searchCollection.filter(item => item.selected).map(item => item.id);
        // this.getAllImages();
    }

    public changeIndianSearchCollection($event: any) {
        this.indianCollid = $event.value;
        // console.log(this.filter.coll_id);
        // this.filter.coll_id = this.searchCollection.filter(item => item.selected).map(item => item.id);
        // this.getAllImages();
    }

    public closeMenu() {

        if (JSON.stringify(this.filter.coll_id) === JSON.stringify(this.internaltionalCollid.concat(this.indianCollid))) {
            // No Changes, no need to refresh images.
        } else {
            this.filter.coll_id = this.internaltionalCollid.concat(this.indianCollid);
            this.getAllImages();
        }

    }

    public changeOrientation($event: MatRadioChange) {
        console.log($event.value);
        this.filter.orientation = $event.value;
        this.getAllImages();
    }

    public changeImageType($event: MatRadioChange) {
        console.log($event.value);
        this.filter.imageType = $event.value;
        this.getAllImages();
    }

    public changePeople($event: MatRadioChange) {
        console.log($event.value);
        this.filter.people = $event.value;
        this.getAllImages();
    }

    public changeGender($event: MatRadioChange) {
        this.filter.gender = $event.value;
        this.getAllImages();
    }

    public changeAge($event: MatRadioChange) {
        this.filter.age = $event.value;
        this.getAllImages();
    }

    public changeEthinicity($event: MatRadioChange) {
        this.filter.ethnicity = $event.value;
        this.getAllImages();
    }

    public changeSorting() {
        this.filter.sort = this.sortings.filter(item => item.selected).map(item => item.name)[0];
        // this.getAllImages();
    }

    public changeViewType(viewType, viewCol) {
        this.viewType = viewType;
        this.viewCol = viewCol;

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

    selectAll(select: MatSelect, values) {
        select.value = values;
        this.internaltionalCollid = values;
        console.log(this.internaltionalCollid); // selectedYears is still undefined
    }

    deselectAll(select: MatSelect) {
        this.internaltionalCollid = [];
        select.value = [];
        console.log(this.internaltionalCollid);
    }

    // public onChangeCategory(event){
    //   if(event.target){
    //     this.router.navigate(['/detail', event.target.innerText.toLowerCase()]);
    //   }
    // }
    getName(name: string) {

        if (name == 'orientation') {
            return this.orientations.find(x => x.value == this.filter.orientation).name;
        } else if (name == 'imageType') {
            return this.imageTypes.find(x => x.value == this.filter.imageType).name;
        }
        if (name == 'people') {
            return this.peoples.find(x => x.value == this.filter.people).name;
        }
        if (name == 'gender') {
            return this.gender.find(x => x.value == this.filter.gender).name;
        }
        if (name == 'age') {
            return this.ages.find(x => x.value == this.filter.age).name;
        }
        if (name == 'ethnicity') {
            return this.ethinicity.find(x => x.value == this.filter.ethnicity).name;
        }
        if (name == 'indian-coll') {
            return 'Indian Coll- ' + this.indianCollid.length;
        }
        if (name == 'inter-coll') {
            return 'International Coll- ' + this.internaltionalCollid.length;
        }

    }

    removeFilter(name: string) {
        // let index = 0;
        if (name == 'orientation') {
            this.filter.orientation = '';
        } else if (name == 'imageType') {
            this.filter.imageType = '';
        }
        if (name == 'people') {
            this.filter.people = '';
        }
        if (name == 'gender') {
            this.filter.gender = '';
        }
        if (name == 'age') {
            this.filter.age = '';
        }
        if (name == 'ethnicity') {
            this.filter.ethnicity = '';
        }

        this.getAllImages();
    }

    removeFilterLicense(name: string, type: string) {
        const index = this.license_type.findIndex((obj => obj.name == type));
        this.license_type[index].selected = false;

        this.filter.license = this.license_type.filter(item => item.selected).map(item => item.name);
        this.getAllImages();
    }

    removeFilterColl(name: string, collSelect: MatSelect) {
        if (name == 'indian-coll') {
            this.indianCollid = [];
        }
        if (name == 'inter-coll') {
            this.internaltionalCollid = [];
        }
        this.closeMenu();
        this.deselectAll(collSelect);

    }

    clearAll(indCollSelect: MatSelect, intCollSelect: MatSelect) {
        this.filter = new Filter([], '', '', '', '', '', '', '', [], '');
        this.indianCollid = [];
        this.internaltionalCollid = [];
        this.deselectAll(indCollSelect);
        this.deselectAll(intCollSelect);

        this.license_type[0].selected = false;
        this.license_type[1].selected = false;
        this.getAllImages();
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

    convertQueryStringToObject() {

        this.activatedRoute.queryParams.subscribe(params => {
            this.filter.license = params.license.split(',');
            this.filter.orientation = params.orientation;
            this.filter.imageType = params.imageType;
            this.filter.people = params.people;
            this.filter.gender = params.gender;
            this.filter.age = params.age;
            this.filter.ethnicity = params.ethnicity;
            this.filter.sort = params.sort;
            this.filter.coll_id = params.coll_id.split(',');
            this.filter.advsearchtxt = params.advsearchtxt;
            this.license_type[0].selected = this.filter.license.includes('RM') ? true : false;
            this.license_type[1].selected = this.filter.license.includes('RF') ? true : false;
        });
        // console.log(this.filter);
        // console.log(this.internaltionalCollid);
    }

    getCollectionName(collection) {
        const arr: Array<any> = [];
        for (let i = 0; i < collection.length; i++) {
            const obj = {id: 0, name: ''};
            obj.id = collection[i];
            obj.name = this.appService.Data.categories.filter(item => item.id == obj.id)[0].name;
            arr.push(obj);
        }
        arr.sort((a, b) => a.name.localeCompare(b.name));
        return arr;
    }
}


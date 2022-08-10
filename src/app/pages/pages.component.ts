import {Component, HostListener, OnInit, ViewChild} from '@angular/core';
import {NavigationEnd, Router} from '@angular/router';
import {AppSettings, Settings} from '../app.settings';
import {AppService} from '../app.service';
import {AuthenticationService} from '../authentication.service';
import {Category, User} from '../app.models';
import {SidenavMenuService} from '../theme/components/sidenav-menu/sidenav-menu.service';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MatSnackBar} from '@angular/material';
import {SearchService} from '../search.service';

@Component({
    selector: 'app-pages',
    templateUrl: './pages.component.html',
    styleUrls: ['./pages.component.scss'],
    providers: [SidenavMenuService]
})
export class PagesComponent implements OnInit {
    public showBackToTop = false;
    public categories: Category[];
    public category: Category;
    public sidenavMenuItems: Array<any>;
    searchForm: FormGroup;
    public arr: Array<any>;
    public currentUser: User;
    @ViewChild('sidenav', {static: true}) sidenav: any;

    public settings: Settings;

    constructor(public appSettings: AppSettings,
                public appService: AppService,
                public sidenavMenuService: SidenavMenuService,
                public router: Router,
                public formBuilder: FormBuilder,
                public snackBar: MatSnackBar, public authService: AuthenticationService,
                private searchService: SearchService) {
        this.authService.currentUser.subscribe(x => this.currentUser = x);
        this.settings = this.appSettings.settings;
    }

    ngOnInit() {
        this.searchService.search.subscribe(searchText => {
            this.searchForm = this.formBuilder.group({
                // searchText: [localStorage.getItem('searchText'), Validators.required]
                searchText: [searchText, Validators.required]
            });
        });
        this.getCategories();
        this.sidenavMenuItems = this.sidenavMenuService.getSidenavMenuItems();
    }

    public getCategories() {
        this.appService.getCollectionType().subscribe(data => {
            this.categories = data;
            this.searchService.category.subscribe(categoryId => {
                this.category = this.categories.filter(item => item.id == categoryId)[0];
            });
            this.appService.Data.categoriesType = data;
        });
    }

    public changeCategory(event) {
        if (event.target) {
            this.category = this.categories.filter(category => category.name == event.target.innerText)[0];
        }
        if (window.innerWidth < 960) {
            this.stopClickPropagate(event);
        }
    }

    public remove(product) {
        const index: number = this.appService.Data.cartList.indexOf(product);
        if (index !== -1) {
            this.appService.Data.cartList.splice(index, 1);
            this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.newPrice * product.cartCount;
            this.appService.Data.totalCartCount = this.appService.Data.totalCartCount - product.cartCount;
            this.appService.resetProductCartCount(product);
        }
    }

    public clear() {
        this.appService.removeCartList(this.currentUser.customers_id).subscribe(data => {
            if (data.statusCode === 200) {
                this.appService.Data.cartList.forEach(product => {
                    this.appService.resetProductCartCount(product);
                });
                this.appService.Data.cartList.length = 0;
                this.appService.Data.totalPrice = 0;
                this.appService.Data.totalCartCount = 0;
            } else {
                this.snackBar.open('Error in clearing cart', '×', {
                    panelClass: 'error',
                    verticalPosition: 'top',
                    duration: 3000
                });
            }
        });
    }


    public changeTheme(theme) {
        this.settings.theme = theme;
    }

    public stopClickPropagate(event: any) {
        event.stopPropagation();
        event.preventDefault();
    }

    public onSubmit(values: any): void {
        if (this.searchForm.valid) {
            if (this.category.id == 2 || this.category.id == 4) {
                const videoFilter = this.searchService.videoFilter;
                videoFilter.advsearchtxt = values.searchText;
                this.router.navigate(['/search-videos', values.searchText, this.category.id], {queryParams: videoFilter});
            } else {
                const filter = this.searchService.filter;
                filter.advsearchtxt = values.searchText;
                this.router.navigate(['/search', values.searchText, this.category.id], {queryParams: filter});
            }
        } else {
            this.snackBar.open('Add text to search', '×', {
                panelClass: 'error',
                verticalPosition: 'top',
                duration: 5000
            });
        }

    }

    public scrollToTop() {
        const scrollDuration = 200;
        const scrollStep = -window.pageYOffset / (scrollDuration / 20);
        const scrollInterval = setInterval(() => {
            if (window.pageYOffset != 0) {
                window.scrollBy(0, scrollStep);
            } else {
                clearInterval(scrollInterval);
            }
        }, 10);
        if (window.innerWidth <= 768) {
            setTimeout(() => {
                window.scrollTo(0, 0);
            });
        }
    }

    @HostListener('window:scroll', [])
    onWindowScroll() {
        (document.body.scrollTop > 50 ||
            document.documentElement.scrollTop > 50) ? this.showBackToTop = true : this.showBackToTop = false;

        if (document.body.scrollTop > 100 ||
            document.documentElement.scrollTop > 100) {
            document.getElementById('logo-toolbar').classList.add('logo-toolbar-sticky');
        } else {
            document.getElementById('logo-toolbar').classList.remove('logo-toolbar-sticky');
        }
    }

    ngAfterViewInit() {
        this.router.events.subscribe(event => {
            if (event instanceof NavigationEnd) {
                this.sidenav.close();
            }
        });
        this.sidenavMenuService.expandActiveSubMenu(this.sidenavMenuService.getSidenavMenuItems());
    }

    public closeSubMenus() {
        if (window.innerWidth < 960) {
            this.sidenavMenuService.closeAllSubMenus();
        }
    }

}

import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SwiperModule} from 'ngx-swiper-wrapper';
import {FlexLayoutModule} from '@angular/flex-layout';
import { MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatChipsModule,
    MatDatepickerModule,
    MatDialogModule,
    MatExpansionModule,
    MatGridListModule,
    MatIconModule,
    MatInputModule,
    MatListModule,
    MatMenuModule,
    MatNativeDateModule,
    MatPaginatorModule,
    MatProgressBarModule,
    MatProgressSpinnerModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatSidenavModule,
    MatSliderModule,
    MatSlideToggleModule,
    MatSnackBarModule,
    MatSortModule,
    MatStepperModule,
    MatTableModule,
    MatTabsModule,
    MatToolbarModule,
    MatTooltipModule
} from '@angular/material';

import {PERFECT_SCROLLBAR_CONFIG, PerfectScrollbarConfigInterface, PerfectScrollbarModule} from 'ngx-perfect-scrollbar';
import {ReactiveFormsModule} from '@angular/forms';
import {LazyLoadImageModule} from 'ng-lazyload-image';
import {RecaptchaFormsModule, RecaptchaModule} from 'ng-recaptcha';
import {PipesModule} from '../theme/pipes/pipes.module';
import {ControlsComponent} from './controls/controls.component';
import {MainCarouselComponent} from './main-carousel/main-carousel.component';
import {ProductsCarouselComponent} from './products-carousel/products-carousel.component';
import {ProductDialogComponent} from './products-carousel/product-dialog/product-dialog.component';
import {VideoPreviewComponent} from './video-listing/video-preview/video-preview.component';
import {SignInDialogComponent} from './sign-in-dialog/sign-in-dialog.component';
import {ShareDialogComponent} from './share-dialog/share-dialog.component';
import {ForgotPasswordComponent} from './forgot-password/forgot-password.component';
import {WishlistDialogComponent} from './wishlist-dialog/wishlist-dialog.component';
import {BannersComponent} from './banners/banners.component';
import {EditorialBannersComponent} from './editorial-banners/editorial-banners.component';
import {BannersVideosComponent} from './banners-videos/banners-videos.component';
import {VideoListingComponent} from './video-listing/video-listing.component';
import {CategoryListComponent} from './category-list/category-list.component';
import {CustomPaginationComponent} from './custom-pagination/custom-pagination.component';
import {NgxPaginationModule} from "ngx-pagination";

const DEFAULT_PERFECT_SCROLLBAR_CONFIG: PerfectScrollbarConfigInterface = {
    wheelPropagation: true,
    suppressScrollX: true
};

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        SwiperModule,
        FlexLayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatStepperModule,
        PerfectScrollbarModule,
        PipesModule,
        ReactiveFormsModule,
        LazyLoadImageModule,
        RecaptchaModule,
        RecaptchaFormsModule,
        NgxPaginationModule,
    ],
    exports: [
        RouterModule,
        SwiperModule,
        FlexLayoutModule,
        MatAutocompleteModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatCardModule,
        MatCheckboxModule,
        MatChipsModule,
        MatDatepickerModule,
        MatDialogModule,
        MatExpansionModule,
        MatGridListModule,
        MatIconModule,
        MatInputModule,
        MatListModule,
        MatMenuModule,
        MatNativeDateModule,
        MatPaginatorModule,
        MatProgressBarModule,
        MatProgressSpinnerModule,
        MatRadioModule,
        MatRippleModule,
        MatSelectModule,
        MatSidenavModule,
        MatSliderModule,
        MatSlideToggleModule,
        MatSnackBarModule,
        MatSortModule,
        MatTableModule,
        MatTabsModule,
        MatToolbarModule,
        MatTooltipModule,
        MatStepperModule,
        PerfectScrollbarModule,
        PipesModule,
        ControlsComponent,
        MainCarouselComponent,
        ProductsCarouselComponent,
        ProductDialogComponent,
        SignInDialogComponent,
        WishlistDialogComponent,
        ShareDialogComponent,
        ForgotPasswordComponent,
        BannersComponent,
        EditorialBannersComponent,
        BannersVideosComponent,
        VideoListingComponent,
        CategoryListComponent,
        LazyLoadImageModule,
        VideoPreviewComponent,
        RecaptchaModule,
        RecaptchaFormsModule,
        CustomPaginationComponent
    ],
    declarations: [
        ControlsComponent,
        MainCarouselComponent,
        ProductsCarouselComponent,
        ProductDialogComponent,
        SignInDialogComponent,
        ShareDialogComponent,
        ForgotPasswordComponent,
        WishlistDialogComponent,
        BannersComponent,
        EditorialBannersComponent,
        BannersVideosComponent,
        VideoListingComponent,
        VideoPreviewComponent,
        CategoryListComponent,
        CustomPaginationComponent

    ],
    entryComponents: [
        ProductDialogComponent,
        SignInDialogComponent,
        ShareDialogComponent,
        ForgotPasswordComponent,
        WishlistDialogComponent,
        VideoPreviewComponent
    ],
    providers: [
        {provide: PERFECT_SCROLLBAR_CONFIG, useValue: DEFAULT_PERFECT_SCROLLBAR_CONFIG}
    ]
})
export class SharedModule { }

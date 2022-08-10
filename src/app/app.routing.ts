import {RouterModule, Routes} from '@angular/router';
import {ModuleWithProviders} from '@angular/core';

import {PagesComponent} from './pages/pages.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {AuthGuard} from './auth.guard';
import {PlanPagesComponent} from './pages/plan-pages.component';

export const routes: Routes = [
    // { path: 'subscription', component: PlanComponent},
    {
        path: '',
        component: PagesComponent, children: [
            {path: '', loadChildren: () => import('./pages/home/home.module').then(m => m.HomeModule)},
            {path: 'editorial', loadChildren: () => import('./pages/editorial/editorial.module').then(m => m.EditorialModule)},
            {path: 'videos', loadChildren: () => import('./pages/videos/video.module').then(m => m.VideoModule)},
            {path: 'subscription', loadChildren: () => import('./pages/plan/plan.module').then(m => m.PlanModule)},
            {
                path: 'account',
                loadChildren: () => import('./pages/account/account.module').then(m => m.AccountModule),
                data: {breadcrumb: 'Account Settings'}
            },
            {
                path: 'lightboxlist',
                loadChildren: () => import('./pages/wishlist/wishlist.module').then(m => m.WishlistModule),
                data: {breadcrumb: 'Wishlist'},
                canActivate: [AuthGuard]
            },
            {
                path: 'lightbox-detail',
                loadChildren: () => import('./pages/wishlist-detail/wishlist-detail.module').then(m => m.WishlistDetailModule),
                data: {breadcrumb: 'Wishlist'}
            },
            {
                path: 'lightbox',
                loadChildren: () => import('./pages/wishlist-detail/wishlist-detail.module').then(m => m.WishlistDetailModule),
                data: {breadcrumb: 'Wishlist'}
            },
            {path: 'cart', loadChildren: () => import('./pages/cart/cart.module').then(m => m.CartModule), data: {breadcrumb: 'Cart'}},
            {
                path: 'checkout',
                loadChildren: () => import('./pages/checkout/checkout.module').then(m => m.CheckoutModule),
                data: {breadcrumb: 'Checkout'}
            },
            {
                path: 'contact',
                loadChildren: () => import('./pages/contact/contact.module').then(m => m.ContactModule),
                data: {breadcrumb: 'Contact'}
            },
            {path: 'about', loadChildren: () => import('./pages/about/about.module').then(m => m.AboutModule), data: {breadcrumb: 'About'}},
            {
                path: 'privacypolicy',
                loadChildren: () => import('./pages/privacy-policy/privacy-policy.module').then(m => m.PrivacyPolicyModule),
                data: {breadcrumb: 'Privacy Policy'}
            },
            {
                path: 'disclaimer',
                loadChildren: () => import('./pages/disclaimer/disclaimer.module').then(m => m.DisclaimerModule),
                data: {breadcrumb: 'Disclaimer'}
            },
            {
                path: 'license',
                loadChildren: () => import('./pages/license/license.module').then(m => m.LicenseModule),
                data: {breadcrumb: 'License'}
            },
            {
                path: 'sign-in',
                loadChildren: () => import('./pages/sign-in/sign-in.module').then(m => m.SignInModule),
                data: {breadcrumb: 'Sign In '}
            },
            {
                path: 'search',
                loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsModule),
                data: {breadcrumb: 'All Images'}
            },
            {
                path: 'search-videos',
                loadChildren: () => import('./pages/search-videos/search-videos.module').then(m => m.SearchVideosModule),
                data: {breadcrumb: 'All Videos'}
            },
            {
                path: 'detail',
                loadChildren: () => import('./pages/products/product/product.module').then(m => m.ProductModule),
                data: {breadcrumb: 'Product'}
            },
            {
                path: 'video-detail',
                loadChildren: () => import('./pages/search-videos/video/video.module').then(m => m.VideoModule),
                data: {breadcrumb: 'Product'}
            },
            {
                path: 'success',
                loadChildren: () => import('./pages/success/success.module').then(m => m.SuccessModule),
                data: {breadcrumb: 'Success'}
            },
            {
                path: 'verification',
                loadChildren: () => import('./pages/verification/verification.module').then(m => m.VerificationModule),
                data: {breadcrumb: 'Verification'}
            },
            {
                path: 'failed',
                loadChildren: () => import('./pages/failed/failed.module').then(m => m.FailedModule),
                data: {breadcrumb: 'Failure'}
            },
            {
                path: 'change-password',
                loadChildren: () => import('./pages/change-password/change-password.module').then(m => m.ChangePasswordModule),
                data: {breadcrumb: 'Change password'}
            },
            {
                path: 'contributor',
                loadChildren: () => import('./pages/contributor-profile/contributor-profile.module').then(m => m.ContributorProfileModule),
                data: {breadcrumb: 'Contributor'}
            },
        ]
    },
    {
        path: '',
        component: PlanPagesComponent, children: [
            {path: 'subscriptionew', loadChildren: () => import('./pages/plan/plan.module').then(m => m.PlanModule)},
        ]
    },
    {path: '**', component: NotFoundComponent},

];

export const routing: ModuleWithProviders = RouterModule.forRoot(routes, {
    // preloadingStrategy: PreloadAllModules,  // <- comment this line for activate lazy load
    // useHash: true
});

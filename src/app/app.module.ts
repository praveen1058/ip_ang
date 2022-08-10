import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {NgxSpinnerModule} from 'ngx-spinner';
import {AgmCoreModule} from '@agm/core';
import {ReactiveFormsModule} from '@angular/forms';
import {Overlay, OverlayContainer} from '@angular/cdk/overlay';
import {MAT_MENU_SCROLL_STRATEGY} from '@angular/material';
import {CustomOverlayContainer} from './theme/utils/custom-overlay-container';
import {menuScrollStrategy} from './theme/utils/scroll-strategy';

import {SharedModule} from './shared/shared.module';
import {routing} from './app.routing';
import {AppComponent} from './app.component';
import {PagesComponent} from './pages/pages.component';
import {NotFoundComponent} from './pages/not-found/not-found.component';
import {PlanPagesComponent} from './pages/plan-pages.component';
import {TopMenuComponent} from './theme/components/top-menu/top-menu.component';
import {MenuComponent} from './theme/components/menu/menu.component';
import {PlanMenuComponent} from './theme/components/plan-menu/plan-menu.component';
import {SidenavMenuComponent} from './theme/components/sidenav-menu/sidenav-menu.component';
import {BreadcrumbComponent} from './theme/components/breadcrumb/breadcrumb.component';

import {AppSettings} from './app.settings';
import {AppService} from './app.service';
import {NavbarService} from './navbar.service';
import {SearchService} from './search.service';
import {AppInterceptor} from './theme/utils/app-interceptor';
import {OptionsComponent} from './theme/components/options/options.component';
import {FooterComponent} from './theme/components/footer/footer.component';
import {JwtInterceptor} from './jwt.interceptor';
import {SpellCheckerModule} from 'ngx-spellchecker';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';
import {ShareIconsModule} from 'ngx-sharebuttons/icons';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        HttpClientModule,
        NgxSpinnerModule,
        AgmCoreModule.forRoot({
            apiKey: 'AIzaSyDLf9Ywk47zipEtorDewwMmB3JtuXdzYL4'
        }),
        SharedModule,
        ReactiveFormsModule,
        routing,
        SpellCheckerModule.forRoot(),
        ShareButtonsModule.withConfig({
            debug: true
        }),
        ShareIconsModule
    ],
    declarations: [
        AppComponent,
        PagesComponent,
        NotFoundComponent,
        PlanPagesComponent,
        TopMenuComponent,
        MenuComponent,
        PlanMenuComponent,
        SidenavMenuComponent,
        BreadcrumbComponent,
        OptionsComponent,
        FooterComponent
    ],
    providers: [
        AppSettings,
        AppService,
        NavbarService,
        SearchService,
        {provide: OverlayContainer, useClass: CustomOverlayContainer},
        {provide: MAT_MENU_SCROLL_STRATEGY, useFactory: menuScrollStrategy, deps: [Overlay]},
        {provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: AppInterceptor, multi: true},

    ],
    bootstrap: [AppComponent]
})
export class AppModule {
}

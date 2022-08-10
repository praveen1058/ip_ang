import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import {ContributorProfileComponent} from './contributor-profile.component';
import {ShareButtonsModule} from 'ngx-sharebuttons/buttons';

export const routes = [
    { path: '', component: ContributorProfileComponent, pathMatch: 'full' },
    { path: ':collection/:code/:type/:category', component: ContributorProfileComponent },
    { path: ':collection/:code/:type/:category/:search', component: ContributorProfileComponent },
];

@NgModule({
    imports: [
        CommonModule,
        RouterModule.forChild(routes),
        FormsModule,
        ReactiveFormsModule,
        SwiperModule,
        NgxPaginationModule,
        SharedModule,
        PipesModule,
        ShareButtonsModule
    ],
    declarations: [
        ContributorProfileComponent

    ]
})
export class ContributorProfileModule { }

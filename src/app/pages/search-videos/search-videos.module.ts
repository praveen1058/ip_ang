import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../shared/shared.module';
import { PipesModule } from '../../theme/pipes/pipes.module';
import { SearchVideosComponent } from './search-videos.component';
import { Ng5SliderModule } from 'ng5-slider';


export const routes = [
  { path: '', component: SearchVideosComponent, pathMatch: 'full' },
  { path: ':name', component: SearchVideosComponent },
  { path: ':name/:category', component: SearchVideosComponent },
  { path: ':name/:category/:filter', component: SearchVideosComponent }
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
   Ng5SliderModule
  ],
  declarations: [
      SearchVideosComponent
  ]
})
export class SearchVideosModule { }

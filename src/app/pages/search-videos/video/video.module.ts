import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { PipesModule } from '../../../theme/pipes/pipes.module';
import { VideoComponent } from './video.component';

export const routes = [
  { path: '', component: VideoComponent, pathMatch: 'full' },
  { path: ':collection/:id', component: VideoComponent },
  { path: ':collection/:id/:caption', component: VideoComponent }
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
    PipesModule
  ],
  declarations: [
      VideoComponent
  ],
  entryComponents: [
  ]
})
export class VideoModule { }

import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { VideoComponent } from './video.component';
import { LazyLoadImageModule, scrollPreset  } from 'ng-lazyload-image';

export const routes = [
  { path: '', component: VideoComponent, pathMatch: 'full'  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule,
      LazyLoadImageModule.forRoot({
          preset: scrollPreset
      })
  ],
  declarations: [
      VideoComponent
  ]
})
export class VideoModule { }
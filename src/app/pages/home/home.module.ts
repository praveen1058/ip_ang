import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { HomeComponent } from './home.component';
import { LazyLoadImageModule, scrollPreset  } from 'ng-lazyload-image';

export const routes = [
  { path: '', component: HomeComponent, pathMatch: 'full'  }
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
    HomeComponent
  ]
})
export class HomeModule { }
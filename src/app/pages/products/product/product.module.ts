import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SwiperModule } from 'ngx-swiper-wrapper';
import { NgxPaginationModule } from 'ngx-pagination';
import { SharedModule } from '../../../shared/shared.module';
import { PipesModule } from '../../../theme/pipes/pipes.module';
import { ProductComponent } from './product.component';
import { ProductPreviewComponent } from './product-preview/product-preview.component';

export const routes = [
  { path: '', component: ProductComponent, pathMatch: 'full' },
  { path: ':collection/:id', component: ProductComponent },
  { path: ':collection/:id/:caption', component: ProductComponent }
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
    ProductComponent,
      ProductPreviewComponent
  ],
  entryComponents:[
      ProductPreviewComponent
  ]
})
export class ProductModule { }

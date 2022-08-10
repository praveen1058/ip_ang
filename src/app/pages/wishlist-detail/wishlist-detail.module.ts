import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { WishlistDetailComponent } from './wishlist-detail.component';

export const routes = [
  { path: '', component: WishlistDetailComponent, pathMatch: 'full' },
    { path: ':id', component: WishlistDetailComponent },
    { path: 'share/:token', component: WishlistDetailComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule
  ],
  declarations: [
      WishlistDetailComponent
  ]
})
export class WishlistDetailModule { }

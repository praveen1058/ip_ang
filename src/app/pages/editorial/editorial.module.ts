import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { SharedModule } from '../../shared/shared.module';
import { EditorialComponent } from './editorial.component';

export const routes = [
  { path: '', component: EditorialComponent, pathMatch: 'full'  }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    SharedModule   
  ],
  declarations: [
      EditorialComponent
  ]
})
export class EditorialModule { }
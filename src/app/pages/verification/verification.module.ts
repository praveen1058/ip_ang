import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { VerificationComponent } from './verification.component';

export const routes = [
  { path: '', component: VerificationComponent, pathMatch: 'full' },
    { path: ':token', component: VerificationComponent }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
      VerificationComponent
  ]
})
export class VerificationModule { }

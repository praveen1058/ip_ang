import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../../shared/shared.module';
import { PrivacyPolicyComponent } from './privacy-policy.component';

export const routes = [
  { path: '', component: PrivacyPolicyComponent, pathMatch: 'full' }
];

@NgModule({
  imports: [
    CommonModule,
    RouterModule.forChild(routes),
    ReactiveFormsModule,
    SharedModule
  ],
  declarations: [
      PrivacyPolicyComponent
  ]
})
export class PrivacyPolicyModule { }

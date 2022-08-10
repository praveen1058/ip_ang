import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';

import {MAT_DIALOG_DATA, MatDialog} from '@angular/material/dialog';
import {Category, User} from '../../../../app.models';
import {AppService} from '../../../../app.service';
import {AuthenticationService} from '../../../../authentication.service';

@Component({
  selector: 'app-view-permission',
  templateUrl: './show-collection.component.html',
  styleUrls: ['./show-collection.component.scss']
})
export class ShowCollectionComponent implements OnInit {
  public currentUser: User;
  public customerPlans: any[];
  public collection: string;
  public size: string;
  public categories: Category[];
  public plan: any;

  @Output() onClose = new EventEmitter<any>(true);
  @Output() onReset = new EventEmitter<any>(true);
  constructor(public appService: AppService,
              public authService: AuthenticationService,
               @Inject(MAT_DIALOG_DATA) public data: any) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.getCategories();
    this.plan = this.data.customerPlan;
  }


  public getCategories() {
    if (this.appService.Data.categories.length == 0) {
      this.appService.getCategories().subscribe(data => {
        this.categories = data;
        this.appService.Data.categories = data;

      });
    } else {
      this.categories = this.appService.Data.categories;
    }
  }

  public getCollection(collectrionStr: any) {
    this.collection = '';

    const collArr = collectrionStr.split(',');
    for (let i = 0; i < collArr.length; i++) {
      if (i > 0) {
        this.collection += ', ';
      }
      if (this.categories.filter(category => category.id == collArr[i].trim())[0]) {
        this.collection += this.categories.filter(category => category.id == collArr[i].trim())[0].name;
      }
    }
    return this.collection;
  }

}

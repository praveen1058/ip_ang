import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import {AuthenticationService} from '../../../authentication.service';
import {User, Order, Category} from '../../../app.models';
import {ShowCollectionComponent} from "./show-collection-dialog/show-collection.component";
import {MatDialog} from "@angular/material/dialog";

@Component({
  selector: 'app-package-history',
  templateUrl: './package-history.component.html',
  styleUrls: ['./package-history.component.scss']
})
export class PackageHistoryComponent implements OnInit {
public currentUser: User;
public orders: Order[];
public collection: string;
public size: string;
public categories: Category[];
  // public orders = [
  //   { number: '#3258', date: 'March 29, 2018', status: 'Completed', total: '$140.00 for 2 items', invoice: true },
  //   { number: '#3145', date: 'February 14, 2018', status: 'On hold', total: '$255.99 for 1 item', invoice: false },
  //   { number: '#2972', date: 'January 7, 2018', status: 'Processing', total: '$255.99 for 1 item', invoice: true },
  //   { number: '#2971', date: 'January 5, 2018', status: 'Completed', total: '$73.00 for 1 item', invoice: true },
  //   { number: '#1981', date: 'December 24, 2017', status: 'Pending Payment', total: '$285.00 for 2 items', invoice: false },
  //   { number: '#1781', date: 'September 3, 2017', status: 'Refunded', total: '$49.00 for 2 items', invoice: false }
  // ]
  constructor(public appService: AppService, public authService: AuthenticationService,
              private dialog: MatDialog) {
      this.authService.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
      this.getCategories();
      this.appService.getPackageHistory(this.currentUser.customers_id).subscribe(data => {
        this.orders = data;
      });
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

  public getCollection(order) {
      this.collection = '';

      const collArr = order.collection.split(',');
      for (let i = 0; i < collArr.length; i++) {
          if (i > 0) {
              this.collection += ', ';
          }
          this.collection += this.categories.filter(category => category.id == collArr[i].trim())[0].name;
   }
      return this.collection;
  }

    public getSize(order) {
        this.size = '';
        const collArr = order.sizes.split(',');

        for (let i = 0; i < collArr.length; i++) {
            if (i > 0) {
                this.size += ', ';
            }
            this.size += this.appService.getSizes().filter(sizes => sizes.id == collArr[i].trim())[0].name;
        }
        return this.size;
    }

    showCollection(customerPlan) {
        const customerPlanId = customerPlan.id;
        console.log(customerPlanId);
        const dialogRef = this.dialog.open(ShowCollectionComponent, {
            width: '80vw',
            maxWidth: '100vw',
            data: {
                customerPlan
            },
            disableClose: false,
            autoFocus: false
        });
        const close = dialogRef.componentInstance.onClose.subscribe(() => {
            dialogRef.close();
        });
        const reset = dialogRef.componentInstance.onReset.subscribe(() => {
            // this.reset();
        });
    }

}

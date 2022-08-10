import { Component, OnInit } from '@angular/core';
import { MatSnackBar, MatDialog } from '@angular/material';
import {  AppService } from '../../app.service';
import {AuthenticationService } from '../../authentication.service';
import { User } from '../../app.models';
import { ShareDialogComponent } from '../../shared/share-dialog/share-dialog.component';

@Component({
  selector: 'app-wishlist',
  templateUrl: './wishlist.component.html',
  styleUrls: ['./wishlist.component.scss']
})
export class WishlistComponent implements OnInit {
  constructor(public appService: AppService, public snackBar: MatSnackBar,
              public authservice: AuthenticationService, public dialog: MatDialog) {
      this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  wishList: any;
  currentUser: User;

  ngOnInit() {
      this.getWishList();
  }

  public getWishList() {
        this.appService.getWishList(this.currentUser.customers_id).subscribe(data => {
            this.wishList = data['data'];
        });
  }

  public remove(wish) {
      this.appService.removeWishList(wish.id).subscribe(data => {
          if(data["statusCode"]==200) {
              this.wishList = data['data'];
          }
      });
  }

  public shareList(wish)
  {
      let dialogRef = this.dialog.open(ShareDialogComponent, {
          data: wish,
          panelClass: 'app-sign-in-dialog',
          direction: 'ltr'
      });
  }
  // public clear(){
  //   this.appService.Data.wishList.length = 0;
  // }

}
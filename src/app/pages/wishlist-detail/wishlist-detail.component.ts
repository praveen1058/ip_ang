import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material';
import { Data, AppService } from '../../app.service';
import { WishList } from '../../app.models';
import { ActivatedRoute,Router } from '@angular/router';

@Component({
  selector: 'app-wishlist-detail',
  templateUrl: './wishlist-detail.component.html',
  styleUrls: ['./wishlist-detail.component.scss']
})
export class WishlistDetailComponent implements OnInit {
  constructor(public appService:AppService,  private activatedRoute: ActivatedRoute, public snackBar: MatSnackBar) {}

    wishList:WishList;
    private sub: any;

  ngOnInit() {
      this.sub = this.activatedRoute.params.subscribe(params => {
          if(params['id']) {
              this.getWishList(params['id'],"id");
          }
          if(params['token'])
          {
              this.getWishList(params['token'],"token");
          }
      });

  }

  public getWishList(id,type) {
      if(type=="id") {
          this.appService.getWishListById(id).subscribe(data => {
              this.wishList = data['data'];
          });
      }
      else{
          this.appService.getWishListByToken(id).subscribe(data => {
              this.wishList = data['data'];
              console.log(this.wishList)
          });
      }
  }

  public clear(){
    this.appService.Data.wishList.length = 0;
  } 

}

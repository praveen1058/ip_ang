import { Component, OnInit } from '@angular/core';
import { Data, AppService } from '../../../app.service';
import { AuthenticationService } from '../../../authentication.service';
import { Settings, AppSettings } from '../../../app.settings';
import { Router } from '@angular/router';
import { User } from '../../../app.models';

@Component({
  selector: 'app-top-menu',
  templateUrl: './top-menu.component.html',
    styleUrls: ['./top-menu.component.scss'],
})

export class TopMenuComponent implements OnInit {
  public currencies = ['INR'];
  public currency:any;
  public currentUser:User;
  public flags = [
    { name:'English', image: 'assets/images/flags/gb.svg' }
  ]
  public flag:any;

  public settings: Settings;
  constructor(public appSettings:AppSettings,
              public appService:AppService,
              public authservice:AuthenticationService,
              public router:Router) {
    this.settings = this.appSettings.settings;
    this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
    this.currency = this.currencies[0];
    this.flag = this.flags[0];
    if(this.currentUser) {
        this.appService.getCartList(this.currentUser.customers_id).subscribe(data => {
            if(data["data"]== null)
            {
                this.appService.addToCart([], 0, 0);
            }else {
                this.appService.addToCart(data["data"]["imagesArray"], data["data"]['total_price'], data["data"]['total_item']);
            }

        });
    }

  }

  public changeCurrency(currency){
    this.currency = currency;
  }

  public changeLang(flag){
    this.flag = flag;
  }


   public logout() {
        this.authservice.logout();
        this.router.navigate(['/']);
    }

}

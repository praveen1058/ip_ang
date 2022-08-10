import { Component, OnInit } from '@angular/core';
import {  AppService } from '../../app.service';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  constructor(public appService:AppService) { }

  ngOnInit() {
    this.clearCart();
  }

  public clearCart() {
      this.appService.Data.cartList.forEach(product=>{
          this.appService.resetProductCartCount(product);
      });
      this.appService.Data.cartList.length = 0;
      this.appService.Data.totalPrice = 0;
      this.appService.Data.totalCartCount = 0;
  }
}

import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import { AppService } from '../../app.service';
import {AuthenticationService} from '../../authentication.service';
import {User} from '../../app.models';

import {MatSnackBar} from '@angular/material';
@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.scss']
})
export class CartComponent implements OnInit {
  total = [];
  // grandTotal = 0;
  cartItemCount = [];
  cartItemCountTotal = 0;
  public currentUser: User;

  constructor(public appService: AppService, public authService: AuthenticationService, public snackBar: MatSnackBar) {
    this.authService.currentUser.subscribe(x => this.currentUser = x);
}

    @ViewChild('form', {static: false}) form: ElementRef;
    accessCode: string;
    ccavenueUrl: string;
    encRequestRes: any;
    cashfreeUrl: any;
    // selectedAddress: any;

  ngOnInit() {
      console.log(this.appService.Data.cartList);

    // this.appService.Data.cartList.forEach(product => {
    //   this.total[product.id] = product.id;
    //   this.total[product.price] = product.price;
    //   this.grandTotal += parseInt(product.price + '');
    //   this.cartItemCount[product.id] = 1;
    //   this.cartItemCountTotal += 1;
    // });

      this.accessCode = this.appService.accessCode;
      this.ccavenueUrl = this.appService.ccavenueUrl;
      this.cashfreeUrl = this.appService.cashfreeUrl;

      // this.selectedAddress = {
    //       name : this.currentUser.customers_firstname + ' ' + this.currentUser.customers_lastname,
    //       address : this.currentUser.customers_address_line1,
    //       city : this.currentUser.customers_city,
    //       pincode : this.currentUser.customers_postcode,
    //       state : this.currentUser.customers_state,
    //       phone : this.currentUser.customers_telephone
    //   };
  }

  public remove(product) {
    const index: number = this.appService.Data.cartList.indexOf(product);
    if (index !== -1) {
        this.appService.removeCartProduct(JSON.stringify(product), this.currentUser.customers_id).subscribe(data => {
            if (data.statusCode === 200) {
                this.appService.Data.cartList.splice(index, 1);
                // this.grandTotal = this.grandTotal - this.total[product.price];
                this.appService.Data.totalPrice = this.appService.Data.totalPrice - product.price;
                this.appService.Data.totalCartCount= this.appService.Data.totalCartCount-1;
                // this.total.forEach(val => {
                //     if (val === this.total[product.id]) {
                //         this.total[product.id] = 0;
                //     }
                // });

                // this.cartItemCountTotal = this.cartItemCountTotal - this.cartItemCount[product.id];
                // this.appService.Data.totalCartCount = this.cartItemCountTotal;
                // this.cartItemCount.forEach(val => {
                //     if (val === this.cartItemCount[product.id]) {
                //         this.cartItemCount[product.id] = 0;
                //     }
                // });
                this.appService.resetProductCartCount(product);
            }
        });
    }
  }

  public clear() {

      this.appService.removeCartList(this.currentUser.customers_id).subscribe(data => {
          if (data.statusCode === 200) {
              this.appService.Data.cartList.forEach(product => {
                  this.appService.resetProductCartCount(product);
              });
              this.appService.Data.cartList.length = 0;
              this.appService.Data.totalPrice = 0;
              this.appService.Data.totalCartCount = 0;
          } else {
              this.snackBar.open('Error in clearing cart', '×', {
                  panelClass: 'error',
                  verticalPosition: 'top',
                  duration: 3000
              });
          }

  });
  }

  public checkout() {
      const redirectUrl = this.appService.ccAvenueResponseUrl + 'auth/handleresponse';
      const merchant = this.appService.merchant;
      const request = `merchant_id=${merchant}&currency=INR&redirect_url=${redirectUrl}&cancel_url=${redirectUrl}&language=EN`;
      this.appService.encryptdata(request, this.currentUser.customers_id).subscribe(
          data => {
              this.encRequestRes = data.response;
              console.log(data.response);
              setTimeout(() => {
                  this.form.nativeElement.submit();
              }, 1000);
          }, error => {
              console.log(error);
          }
      );
  }

  public checkoutNew() {
    // console.log(this.cashfreeUrl);
    const redirectUrlCashfree = this.appService.cashfreeResponseUrl + 'auth/returnCashfree';
    const request = `currency=INR&language=EN&redirect_url=${redirectUrlCashfree}`;
    console.log(request);
    this.appService.encryptdataCashfree(request, this.currentUser.customers_id).subscribe(
        data => {
            this.encRequestRes = data.response;
            console.log(data.response);
            setTimeout(() => {
                this.form.nativeElement.submit();
            }, 1000);
        }, error => {
            console.log(error);
        }
    );
}
}

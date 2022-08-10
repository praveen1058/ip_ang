import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import {AppService} from './app.service';
import {User} from './app.models';
import {tokenName} from '@angular/compiler';

@Injectable({ providedIn: 'root' })
export class AuthenticationService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    public  user;

    constructor(public http: HttpClient, public appService: AppService) {
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem('currentUser')));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): User {
        if (localStorage.getItem('currentUser')) {
            return this.currentUserSubject.value;
        } else {
            this.currentUserSubject.next(null);
            return null;
        }
    }

    public get getAccessToken(): String {
        if (localStorage.getItem('currentUser')) {
            return this.currentUserSubject.value.token;
        } else {
            this.currentUserSubject.next(null);
            return null;
        }
    }

    public login(username, password) {
        return  new Promise(resolve => {
            this.appService.signIn(username, password).subscribe(data => {
                this.user = data.user;
                if (this.user.msg === 'success') {
                    this.user.data.customers_password1 = undefined;
                    localStorage.setItem('currentUser', JSON.stringify(this.user.data));
                    this.currentUserSubject.next(this.user.data);
                    if(data.cart == null)
                    {
                        this.appService.addToCart([], 0, 0);
                    }else {
                        this.appService.addToCart(data.cart.imagesArray, data.cart.total_price, data.cart.total_item);
                    }
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    public register(name, email, phone, password,) {
        return  new Promise(resolve => {
            this.appService.register(name, email, phone, password).subscribe(data => {
                if (data.statusCode === 200) {
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    public updateProfile(firstname, lastname, email, company, com_type, job_desc, address, state, pincode, city, phone, fax) {
        return  new Promise(resolve => {
            const currentUserActive = this.currentUserValue;
            this.appService.updateProfile(firstname, lastname, email, company, com_type, job_desc, address, state, pincode, city
                , phone, fax, currentUserActive.customers_id).subscribe(data => {
                this.user = data;
                if (data) {
                    this.user.customers_password1 = undefined;
                    this.user.token = currentUserActive.token;
                    localStorage.setItem('currentUser', JSON.stringify(this.user));
                    this.currentUserSubject.next(this.user);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }
    public getUserDetail() {
        return  new Promise(resolve => {
            const currentUserActive = this.currentUserValue;
            this.appService.getUserDetail(currentUserActive.customers_email_address).subscribe(data => {
                this.user = data;
                if (data) {
                    this.user.customers_password1 = undefined;
                    this.user.token = currentUserActive.token;
                    localStorage.setItem('currentUser', JSON.stringify(this.user));
                    this.currentUserSubject.next(this.user);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    public changePassword(currentPassword, newPassword) {
        return  new Promise(resolve => {
            const currentUserActive = this.currentUserValue;
            this.appService.changePassword(currentUserActive.customers_email_address, newPassword, currentPassword , currentUserActive.customers_password,false).subscribe(data => {

                if (data.statusCode === 200) {
                    currentUserActive.customers_password = data.pass;
                    this.user.token = currentUserActive.token;
                    localStorage.setItem('currentUser', JSON.stringify(currentUserActive));
                    this.currentUserSubject.next(currentUserActive);
                    resolve(true);
                } else {
                    resolve(false);
                }
            });
        });
    }

    logout() {
        // this.appService.logout().subscribe(data => {
        // remove user from local storage and set current user to null
        localStorage.removeItem('currentUser');
        this.appService.Data.cartList.forEach(product => {
            this.appService.resetProductCartCount(product);
        });
        this.appService.Data.cartList.length = 0;
        this.appService.Data.totalPrice = 0;
        this.appService.Data.totalCartCount = 0;
        this.currentUserSubject.next(null);
       // });
    }
}

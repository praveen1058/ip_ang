import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { AuthenticationService } from '../../authentication.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.component.html',
  styleUrls: ['./account.component.scss']
})
export class AccountComponent implements OnInit {
  @ViewChild('sidenav', { static: true }) sidenav: any;
  public sidenavOpen:boolean = true;
  public links = [
    { name: 'Account Dashboard', href: 'dashboard', icon: 'dashboard' },
    { name: 'Account Information', href: 'addresses', icon: 'person' },
    { name: 'Change Password', href: 'information', icon: 'info' },
    { name: 'Package History', href: 'package-history', icon: 'add_shopping_cart' },
    { name: 'Order History', href: 'orders', icon: 'add_shopping_cart' },
    { name: 'Download Image', href: 'download/image', icon: 'cloud_download' },
    { name: 'Download Video', href: 'download/video', icon: 'cloud_download' },
    { name: 'Sales Download', href: 'sales-download', icon: 'cloud_download' }
  ];
  constructor(public router:Router, public authService:AuthenticationService) { }

  ngOnInit() {
    if(window.innerWidth < 960){
      this.sidenavOpen = false;
    };
  }

  @HostListener('window:resize')
  public onWindowResize():void {
    (window.innerWidth < 960) ? this.sidenavOpen = false : this.sidenavOpen = true;
  }

  ngAfterViewInit(){
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if(window.innerWidth < 960){
          this.sidenav.close();
        }
      }
    });
  }

  logout() {
        this.authService.logout();
        this.router.navigate(['/']);
    }

}

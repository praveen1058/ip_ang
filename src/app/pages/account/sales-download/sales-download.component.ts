import { Component, OnInit } from '@angular/core';
import { AppService } from '../../../app.service';
import {AuthenticationService} from '../../../authentication.service';
import {CartData, User} from '../../../app.models';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-sales-download',
  templateUrl: './sales-download.component.html',
  styleUrls: ['./sales-download.component.scss']
})
export class SalesDownloadComponent implements OnInit {
public currentUser: User;
public orders: any[];
public type: string;
private sub: any;
private cartProduct: CartData;

  constructor(public appService: AppService, public authService: AuthenticationService, private router: Router,
              private activatedRoute: ActivatedRoute) {
      this.authService.currentUser.subscribe(x => this.currentUser = x);
      this.router.routeReuseStrategy.shouldReuseRoute = function() {
          return false;
      };
  }

  ngOnInit() {
      this.appService.getSalesDownload(this.currentUser.customers_id).subscribe(data => {
        this.orders = data;
      });
  }
  public openImage(url: string) {
      window.open(url, '_blank');
  }
    public calculateDiff(dateSent) {
        const currentDate = new Date();
        dateSent = new Date(dateSent);

        return Math.floor((Date.UTC(currentDate.getFullYear(), currentDate.getMonth(),
            currentDate.getDate()) - Date.UTC(dateSent.getFullYear(), dateSent.getMonth(), dateSent.getDate()) ) / (1000 * 60 * 60 * 24));
    }
private createDownloadLink($downloadlink, $id) {
    const url = $downloadlink;
    const a = document.createElement('a');
    a.href = url;
    a.download = $id + '';
    a.target = '_blank';
    document.body.appendChild(a);
    a.click();
}

  public downloadImage(order: any) {
      this.cartProduct = Object.assign({
          id: order.image_id,
          filename: order.filename,
          thumbnail: order.thumbnail,
          license: order.license,
          collection: order.collection,
          size: order.size,
          price: 0,
          caption: order.caption,
          category: order.category,
          downloadLink: order.download_link
      });
      if ( order.download_link !== '' && order.downlad_date != null) {
          this.createDownloadLink(order.download_link, order.image_id);
      } else {
          this.appService.downloadSalesImage(this.cartProduct, false).subscribe(data => {
              this.createDownloadLink(data[0].download_link, order.image_id);
              if (data[0].download_link != null) {
                  order.download_link = data[0].download_link;
              }
          });
      }

  }

  public downloadVideo(order: any) {
      this.cartProduct = Object.assign({
          id: order.image_id,
          filename: order.filename,
          thumbnail: order.thumbnail,
          license: order.license,
          collection: order.collection,
          size: order.size,
          price: 0,
          caption: order.caption,
          category: order.category,
          downloadLink: order.download_link
      });
      if ( order.download_link !== '' && order.downlad_date != null) {
          this.createDownloadLink(order.download_link, order.image_id);
      } else {
          this.appService.downloadSalesVideo(this.cartProduct).subscribe(data => {
              const url = data[0].download_link;
              this.createDownloadLink(data[0].download_link, order.image_id);
              if (data[0].download_link != null) {
                  order.download_link = data[0].download_link;
              }
          });
      }
    }

}

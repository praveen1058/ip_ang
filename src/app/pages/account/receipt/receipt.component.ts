import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { AppService } from '../../../app.service';
import {AuthenticationService} from '../../../authentication.service';
import {User} from '../../../app.models';
import {ActivatedRoute} from "@angular/router";
import * as jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-receipt',
  templateUrl: './receipt.component.html',
  styleUrls: ['./receipt.component.scss']
})
export class ReceiptComponent implements OnInit {
public currentUser: User;
public orderAddress: any;
public orderImages: any;
public orderDetail: any;
public customerPlan: any;
public orderId: number;
public sub:any;
public totalPrice: number;

  constructor(private spinner: NgxSpinnerService, public appService: AppService, public authService: AuthenticationService, private activatedRoute: ActivatedRoute) {
      this.authService.currentUser.subscribe(x => this.currentUser = x);
      this.totalPrice = 0;
  }
    // customer_gst_no, pan_card
  ngOnInit() {
      this.sub = this.activatedRoute.params.subscribe(params => {
          this.orderId = params.id;
      });

      this.appService.getOrderImages(this.orderId).subscribe(data => {
          this.orderAddress = data['orderAddress'];
          this.orderImages = data['orderImages'];
          this.orderDetail = data['order'];
          this.customerPlan = data['customerPlan'];

          for(let i=0; i<= this.orderImages.length; i++)
          {
              this.totalPrice += this.orderImages.price;
          }
      });
  }
    @ViewChild('canvas', {static: false}) canvas: ElementRef;

    public getPDF() {
      let self=this;
      this.spinner.show();
        let HTML_Width =  this.canvas.nativeElement.offsetWidth/1.5;
        let HTML_Height =  this.canvas.nativeElement.offsetHeight/1.5;
        let top_left_margin = 15;
        let PDF_Width = HTML_Width+(top_left_margin*2);
        let PDF_Height = (PDF_Width*1.5)+(top_left_margin*2);
        let canvas_image_width = HTML_Width;
        let canvas_image_height = HTML_Height;

        let totalPDFPages = Math.ceil(HTML_Height/PDF_Height)-1;


        html2canvas( this.canvas.nativeElement ,{allowTaint:true}).then(function(canvas) {
            canvas.getContext('2d');

            console.log(canvas.height+"  "+canvas.width);


            let imgData = canvas.toDataURL("image/jpeg", 1.0);
            let pdf = new jsPDF('p', 'pt',  [PDF_Width, PDF_Height]);
            pdf.addImage(imgData, 'JPG', top_left_margin, top_left_margin,canvas_image_width,canvas_image_height);


            for (let i = 1; i <= totalPDFPages; i++) {
                pdf.addPage(PDF_Width, PDF_Height);
                pdf.addImage(imgData, 'JPG', top_left_margin, -(PDF_Height*i)+(top_left_margin*4),canvas_image_width,canvas_image_height);
            }

            pdf.save("Receipt_"+ self.orderDetail.id);
            self.spinner.hide();
        });
    }

}

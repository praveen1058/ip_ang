import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { Results } from '../../../../app.models';

@Component({
  selector: 'app-product-preview',
  templateUrl: './product-preview.component.html',
  styleUrls: ['./product-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class ProductPreviewComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  constructor(public dialogRef: MatDialogRef<ProductPreviewComponent>,
              @Inject(MAT_DIALOG_DATA) public images: Results) { }

  ngOnInit() { }

  public close(): void {
    this.dialogRef.close();
  }
}
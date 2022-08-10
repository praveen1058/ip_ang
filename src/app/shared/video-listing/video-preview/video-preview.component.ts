import { Component, ViewEncapsulation, OnInit, Inject} from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { SwiperConfigInterface } from 'ngx-swiper-wrapper';

import { Results } from '../../../app.models';

@Component({
  selector: 'app-video-preview',
  templateUrl: './video-preview.component.html',
  styleUrls: ['./video-preview.component.scss'],
  encapsulation: ViewEncapsulation.None
})
export class VideoPreviewComponent implements OnInit {
  public config: SwiperConfigInterface = {};
  constructor(public dialogRef: MatDialogRef<VideoPreviewComponent>,
              @Inject(MAT_DIALOG_DATA) public video: Results) { }

  ngOnInit() { }

  public close(): void {
    this.dialogRef.close();
  }
}

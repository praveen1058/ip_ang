import { Component, OnInit, Input, ElementRef } from '@angular/core';

@Component({
  selector: 'app-banners-video',
  templateUrl: './banners-videos.component.html',
  styleUrls: ['./banners-videos.component.scss']
})
export class BannersVideosComponent implements OnInit {
  @Input('banners') banners: Array<any> = [];

  constructor() { }

  ngOnInit() { }

    hover(index) {
        this.banners[index].isHovering = 1;
        this.banners[index].isHover = true;
    }

    play(video: ElementRef) {
        video.nativeElement.play();
    }


    public getBanner(index) {
    return this.banners[index];
  }

}

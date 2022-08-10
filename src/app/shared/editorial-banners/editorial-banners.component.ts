import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-editorial-banners',
  templateUrl: './editorial-banners.component.html',
  styleUrls: ['./editorial-banners.component.scss']
})
export class EditorialBannersComponent implements OnInit {
  @Input('banners') banners: Array<any> = [];
  @Input('category') category: number;

  constructor() { }

  ngOnInit() {
  }

  public getBanner(index){
    return this.banners[index];
  }

  public getBgImage(index){
    let bgImage = {
      'background-image': index != null ? "url(" + this.banners[index].image + ")" : "url(https://via.placeholder.com/600x400/ff0000/fff/)"
    };
    return bgImage;
  }

}

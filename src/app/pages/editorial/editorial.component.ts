import { Component, OnInit } from '@angular/core';
import { AppService } from '../../app.service';
import { SearchService } from '../../search.service';

@Component({
  selector: 'app-editorial',
  templateUrl: './editorial.component.html',
  styleUrls: ['./editorial.component.scss']
})
export class EditorialComponent implements OnInit {

  public slides = [];
  public brands = [];
  public banners = [];


  constructor(public appService:AppService, public searchService: SearchService) { }

  ngOnInit() {
    this.getSlides();
    this.getBanners();
    this.searchService.setSearch( "");
    this.searchService.setCategory(3);
  }


  public getBanners(){
    this.appService.getBanners("editorial").subscribe(data=>{
      this.banners = data;
    })
  }

    public getSlides() {
        this.appService.getSlides("editorial-slider").subscribe(data => {
            this.slides = data;
        })
    }

}

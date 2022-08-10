import { Component, OnInit, Input, ViewChild} from '@angular/core';
import { NavbarService } from '../../../navbar.service';
import { SearchService } from '../../../search.service';

@Component({
  selector: 'app-plan-menu',
  templateUrl: './plan-menu.component.html',
  styleUrls: ['./plan-menu.component.scss']
})
export class PlanMenuComponent implements OnInit {
    public category: number;
    constructor(public nav: NavbarService, public searchService: SearchService  ) {
    }

  ngOnInit() {
        this.nav.hide();

      this.searchService.category.subscribe(categoryId => {
          this.category = categoryId;
      });
  }

  openMegaMenu() {
    const pane = document.getElementsByClassName('cdk-overlay-pane');
    [].forEach.call(pane, function(el) {
        if (el.children.length > 0) {
          if (el.children[0].classList.contains('mega-menu')) {
            el.classList.add('mega-menu-pane');
          }
        }
    });
  }

}

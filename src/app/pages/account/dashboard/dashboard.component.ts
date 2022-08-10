import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from '../../../authentication.service';
import {User} from "../../../app.models";

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public currentUser: User
  constructor(public authservice:AuthenticationService) {
      this.authservice.currentUser.subscribe(x => this.currentUser = x);
  }

  ngOnInit() {
  }

}

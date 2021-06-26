import { Component, OnInit } from '@angular/core';
import { UserHttpService } from '../user/user-http.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  userID: number;

  constructor() { }

  ngOnInit(): void {
    this.userID = +localStorage.getItem('currentUser');
    console.log(this.userID);
  }

}

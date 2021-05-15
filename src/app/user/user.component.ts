import { Component, OnInit } from '@angular/core';
import { UserHttpService } from './user-http.service';

@Component({
  selector: 'app-user',
  providers: [UserHttpService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}

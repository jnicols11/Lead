import { Component, OnInit } from '@angular/core';
import { UserHttpService } from './user/user-http.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Lead';

  constructor(private userService: UserHttpService) { }

  ngOnInit() {
    // save user in local storage
    this.userService.loggedUser
    .subscribe(
      (id: number) => {
        localStorage.setItem('currentUser', id.toString());
      }
    );
  }
}

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { UserHttpService } from '../user/user-http.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {
  homeFocus = false;
  projectFocus = false;
  regFocus = false;
  logFocus = false;
  accFocus = false;
  localData = localStorage;

  constructor(private userService: UserHttpService, private router: Router) { }

  ngOnInit(): void {
    this.homeFocus = false;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = false;
    this.accFocus = false;
    this.onFocusHome();
  }

  onFocusHome() {
    this.homeFocus = true;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = false;
    this.accFocus = false;
  }

  onFocusProject() {
    this.homeFocus = false;
    this.projectFocus = true;
    this.regFocus = false;
    this.logFocus = false;
    this.accFocus = false;
  }

  onFocusReg() {
    this.homeFocus = false;
    this.projectFocus = false;
    this.regFocus = true;
    this.logFocus = false;
    this.accFocus = false;
  }

  onFocusLog() {
    this.homeFocus = false;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = true;
    this.accFocus = false;
  }

  onFocusAcc() {
    this.homeFocus = false;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = false;
    this.accFocus = true;
  }

  onLogout() {
    // update local storage
    localStorage.setItem('currentUser', '');

    // update focus
    this.homeFocus = true;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = false;
    this.accFocus = false;

    this.router.navigate(['/home']);
  }
}

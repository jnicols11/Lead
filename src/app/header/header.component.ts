import { Component, OnInit } from '@angular/core';

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

  constructor() { }

  ngOnInit(): void {
    this.homeFocus = false;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = false;
    this.onFocusHome();
  }

  onFocusHome() {
    this.homeFocus = true;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = false;
  }

  onFocusProject() {
    this.homeFocus = false;
    this.projectFocus = true;
    this.regFocus = false;
    this.logFocus = false;
  }

  onFocusReg() {
    this.homeFocus = false;
    this.projectFocus = false;
    this.regFocus = true;
    this.logFocus = false;
  }

  onFocusLog() {
    this.homeFocus = false;
    this.projectFocus = false;
    this.regFocus = false;
    this.logFocus = true;
  }
}

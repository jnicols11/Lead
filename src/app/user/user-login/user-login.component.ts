import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { UserHttpService } from '../user-http.service';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  loading = false;

  constructor(private router: Router, private route: ActivatedRoute, private userService: UserHttpService) { }

  ngOnInit(): void {
    this.initForm();
    this.loading = false;
  }

  onCancelLog() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    this.loading = true;
    this.userService.login(this.loginForm.value);
  }

  private initForm() {
    this.loginForm = new FormGroup({
      'credentials': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }
}

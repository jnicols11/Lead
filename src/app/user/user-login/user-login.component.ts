import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserHttpService } from '../user-http.service';
import { User } from '../user.model';

@Component({
  selector: 'app-user-login',
  templateUrl: './user-login.component.html',
  styleUrls: ['./user-login.component.scss']
})
export class UserLoginComponent implements OnInit {
  loginForm: FormGroup;
  error = new Subject<string>();
  loading = false;
  user: User = null;
  loginSuccess = false;
  loginFail = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private userService: UserHttpService
  ) { }

  ngOnInit(): void {
    this.initForm();
    this.loading = false;
    this.loginSuccess = false;
    this.loginFail = false;
  }

  onCancelLog() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    this.loading = true;
    this.userService.login(this.loginForm.value)
    .subscribe(responseData => {
      // populate user from response
      this.user = new User(
        responseData.body['fullName'],
        responseData.body['username'],
        responseData.body['email'],
        responseData.body['password'],
        responseData.body['ID']
      );

      // save user in local storage
      localStorage.setItem('currentUser', this.user.id.toString());

      // update loading status
      this.loading = false;
      this.router.navigate(['/home']);
      this.loginForm.disable();
    }, error => {
      this.loginFail = true;
      this.error.next(error.message);
      this.loading = false;
    })
  }

  private initForm() {
    this.loginForm = new FormGroup({
      'credentials': new FormControl(null, Validators.required),
      'password': new FormControl(null, Validators.required)
    });
  }
}

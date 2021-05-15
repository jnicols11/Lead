import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { User } from '../user.model';
import { UserHttpService } from '../user-http.service';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-user-reg',
  templateUrl: './user-reg.component.html',
  styleUrls: ['./user-reg.component.scss']
})
export class UserRegComponent implements OnInit {
  registerForm: FormGroup;
  error = new Subject<string>();
  errorPopup = false;
  successPopup = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private userService: UserHttpService) { }

  ngOnInit(): void {
    this.initForm();
    this.errorPopup = false;
    this.successPopup = false;
  }

  onCancelReg() {
    this.router.navigate(['../'], { relativeTo: this.route });
  }

  onSubmit() {
    this.userService.register(this.registerForm.value)
    .subscribe(responseData => {
      console.log(responseData);
      this.successPopup = true;
    }, error => {
      this.error.next(error.message);
      this.errorPopup = true;
    });
  }

  private initForm() {
    this.registerForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'username': new FormControl(null, Validators.required),
      'email': new FormControl(null, [Validators.required, Validators.email]),
      'password': new FormControl(null, [Validators.required, Validators.minLength(7)])
    });
  }

}

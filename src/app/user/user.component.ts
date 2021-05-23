import { stringify } from '@angular/compiler/src/util';
import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { UserHttpService } from './user-http.service';
import { User } from './user.model';

@Component({
  selector: 'app-user',
  providers: [UserHttpService],
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.scss']
})
export class UserComponent implements OnInit {
  user: User = null;
  error = new Subject<string>();
  loading = true;
  editName = false;
  editUsername = false;
  editEmail = false;
  errorPopup = false;
  inputName: string;
  inputUsername: string;
  inputEmail: string;

  constructor(private userService: UserHttpService) {
   }

  ngOnInit(): void {
    this.loading = true;
    if(localStorage.getItem('currentUser') == '') {
      console.log('No User Logged in');
    } else {
      this.user = this.userService.getUser(+localStorage.getItem('currentUser')).subscribe(
        responseData => {
          this.user = new User(
            responseData.body['fullName'],
            responseData.body['username'],
            responseData.body['email'],
            responseData.body['password'],
            responseData.body['ID']
          );
          this.inputName = this.user.name;
          this.inputUsername = this.user.username;
          this.inputEmail = this.user.email;
          this.loading = false;
        }
      );
    }
   }


   onPreEditName() {
     this.editName = true;
   }

   onPreEditUsername() {
    this.editUsername = true;
   }

   onPreEditEmail() {
    this.editEmail = true;
   }

   onEditName(inputName: string) {
    if(this.user.name === inputName) {
      // do nothing, no data was changed
      this.onCancelEditName();
    } else {
      // prompt user to confirm

      // send http request to update name
      console.log('updating');
      const data = { name: inputName, id: +localStorage.getItem('currentUser') };
      this.userService.updateName(data).subscribe(
        responseData => {
          console.log("update success");
        }, error => {
          this.errorPopup = true;
          this.error.next(error.message);
        }
      );
    }
   }

   onEditUsername(inputUsername: string) {
    if(this.user.username === inputUsername) {
      // do nothing, no data was changed
      this.onCancelEditUsername();
    } else {
      // prompt user to confirm

      // send http request to update username
      console.log('updating');
      const data = { username: inputUsername, id: +localStorage.getItem('currentUser') };
      this.userService.updateUsername(data).subscribe(
        responseData => {
          console.log("update success");
        }, error => {
          this.errorPopup = true;
          this.error.next(error.message);
        }
      );
    }
   }

   onEditEmail(inputEmail: string) {
    if(this.user.email === inputEmail) {
      // do nothing, no data was changed
      this.onCancelEditEmail();
    } else {
      // prompt user to confirm

      // send http request to update email
      console.log('updating');
      const data = { email: inputEmail, id: +localStorage.getItem('currentUser') };
      this.userService.updateEmail(data).subscribe(
        responseData => {
          console.log("update success");
        }, error => {
          this.errorPopup = true;
          this.error.next(error.message);
        }
      );
    }
   }

   onCancelEditName() {
     this.editName = false;
   }

   onCancelEditUsername() {
     this.editUsername = false;
   }

   onCancelEditEmail() {
     this.editEmail = false;
   }

   clearStatus() {
     this.editName = false;
     this.editUsername = false;
     this.editEmail = false;
   }

   onCloseErrorPopup() {
     this.errorPopup = false;
   }
}

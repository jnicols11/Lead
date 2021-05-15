import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })
export class UserHttpService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  register(user: User) {
    // make Https call to API
    return this.http.post(
      'http://localhost/LeadAPI/api/register',
      user,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  login(user: { credentials: string, password: string }) {
    console.log('Logging in');
  }
}

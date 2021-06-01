import { HttpClient, HttpParams, HttpResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { User } from "./user.model";

@Injectable({ providedIn: 'root' })
export class UserHttpService {
  error = new Subject<string>();
  loggedUser = new Subject<number>();

  constructor(private http: HttpClient) { }

  updateLoggedUser(id: number) {
    this.loggedUser.next(id);
  }

  getUser(id: number): any {
    return this.http.get(
      'http://localhost/LeadAPI/api/getUser/' + id,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

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
    // make Https call to API
    return this.http.post(
      'http://localhost/LeadAPI/api/login',
      user,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  updateName(data: { name: string, id: number }) {
    return this.http.post(
      'http://localhost/LeadAPI/api/updateAccName',
      data,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  updateUsername(data: { username: string, id: number }) {
    return this.http.post(
      'http://localhost/LeadAPI/api/updateAccUsername',
      data,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  updateEmail(data: { email: string, id: number }) {
    return this.http.post(
      'http://localhost/LeadAPI/api/updateAccEmail',
      data,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }
}

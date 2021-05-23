import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Project } from "./project.model";

@Injectable({ providedIn: 'root' })
export class ProjectHttpService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  createProject(project: Project) {
    return this.http.post(
      'http://localhost:3010/project/createProject',
      project,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  getUserProjects(id: number) {
    return this.http.get(
      'http://localhost:3010/project/getUserProjects/' + id,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }
}

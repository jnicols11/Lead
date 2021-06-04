import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Issue } from "./project-dashboard/models/issue.model";
import { Sprint } from "./project-dashboard/models/sprint.model";
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

  getProjectById(projectID: string) {
    return this.http.get(
      'http://localhost:3010/project/getProjectById/' + projectID,
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

  deleteProject(projectID: string) {
    return this.http.delete(
      'http://localhost:3010/project/deleteProject/' + projectID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  createIssue(issue: Issue) {
    return this.http.post(
      'http://localhost:3010/issue/createIssue',
      issue,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  getProjectBacklogIssues(projectID: string) {
    return this.http.get(
      'http://localhost:3010/issue/getProjectIssues/' + projectID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  updateIssue(issue: Issue) {
    return this.http.patch(
      'http://localhost:3010/issue/updateIssue/' + issue.id,
      issue,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  deleteIssue(issue: Issue) {
    return this.http.delete(
      'http://localhost:3010/issue/deleteIssue/' + issue.id,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  createSprint(sprint: Sprint) {
    return this.http.post(
      'http://localhost:3010/sprint/createSprint',
      sprint,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }
}

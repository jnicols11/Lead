import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Issue } from "./project-dashboard/models/issue.model";
import { Sprint } from "./project-dashboard/models/sprint.model";
import { Team } from "./project-dashboard/models/team.model";
import { Project } from "./project.model";

@Injectable({ providedIn: 'root' })
export class ProjectHttpService {
  error = new Subject<string>();

  constructor(private http: HttpClient) { }

  // creates a new project
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

  // gets a project by its Mongo ID
  getProjectById(projectID: string) {
    return this.http.get(
      'http://localhost:3010/project/getProjectById/' + projectID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // gets all projects a user is connected to
  getUserProjects(id: number) {
    return this.http.get(
      'http://localhost:3010/project/getUserProjects/' + id,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // updates a project
  updateProject(project: Project) {
    return this.http.patch(
      'http://localhost:3010/project/updateProject/' + project.id,
      project,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // deletes a project
  deleteProject(projectID: string) {
    return this.http.delete(
      'http://localhost:3010/project/deleteProject/' + projectID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // creates a new issue and places inside a projects backlog
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

  // gets all issues connected to a projects backlog
  getProjectBacklogIssues(projectID: string) {
    return this.http.get(
      'http://localhost:3010/issue/getProjectIssues/' + projectID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // updates an issue inside of a project
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

  // deletes an issue inside of a project
  deleteIssue(issue: Issue) {
    return this.http.delete(
      'http://localhost:3010/issue/deleteIssue/' + issue.id,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // creates a new sprint inside of a project
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

  // get all teams in a project
  getAllTeams(projectID: string) {
    return this.http.get(
      'http://localhost:3010/team/getAllTeams/' + projectID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // get all teams a user is connected to
  getUserTeams(projectID: string, userID: number) {
    return this.http.get(
      'http://localhost:3010/team/getUserTeams/' + projectID + '/' + userID,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // creates a new team
  createTeam(team: Team) {
    return this.http.post(
      'http://localhost:3010/team/createTeam',
      team,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // updates a team
  updateTeam(team: Team) {
    return this.http.patch(
      'http://localhost:3010/team/updateTeam/' + team.id,
      team,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }

  // Deletes a team
  deleteTeam(team: Team) {
    return this.http.delete(
     'http://localhost:3010/team/deleteTeam/' + team.id,
      {
        observe: 'response',
        responseType: 'json'
      }
    )
  }
}

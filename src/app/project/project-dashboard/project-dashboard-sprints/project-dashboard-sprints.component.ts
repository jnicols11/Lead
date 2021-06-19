import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { UserHttpService } from 'src/app/user/user-http.service';
import { ProjectHttpService } from '../../project-http.service';
import { Issue } from '../models/issue.model';
import { Sprint } from '../models/sprint.model';

@Component({
  selector: 'app-project-dashboard-sprints',
  templateUrl: './project-dashboard-sprints.component.html',
  styleUrls: ['./project-dashboard-sprints.component.scss']
})
export class ProjectDashboardSprintsComponent implements OnInit {
  sprintsLoading = true;
  userID: number;
  userRole: string;
  projectID: string;
  focusedSprint: Sprint = null;
  sprints: Sprint[];
  todo: Issue[] = [];
  inProgress: Issue[] = [];
  done: Issue[] = [];
  todoPage = 1;
  doPage = 1;
  donePage = 1;
  error = new Subject<string>();

  constructor(
    private projectService: ProjectHttpService,
    private userService: UserHttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // Set ProjectID
    this.route.queryParams
      .subscribe(
        params => {
          this.projectID = params['id'];
        }
      );

    // set userID
    this.userID = +localStorage.getItem('currentUser');

    // set user role for permissions
    this.userRole = localStorage.getItem('userProjectRole');

    // populate sprints
    this.populateSprints();
  }

  focusSprint(sprint: Sprint) {
    this.focusedSprint = sprint;

    // populate issue structures
    this.populateIssueStructs();
  }

  unfocusSprint() {
    this.focusedSprint = null;

    this.depopulateIssueStructs();
  }

  todoDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.todo, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(this.inProgress,
                        this.todo,
                        event.previousIndex + (5 * (this.doPage - 1)),
                        event.currentIndex);

      if (this.inProgress.length <= (this.doPage - 1) * 5 && this.doPage > 0) {
        this.doPage -= 1;
      }
    }
  }

  doDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.inProgress, event.previousIndex, event.currentIndex);
    } else if(event.previousContainer.id === 'todoList') {
      // item came from todo list
      transferArrayItem(this.todo,
                        this.inProgress,
                        event.previousIndex + (5 * (this.todoPage - 1)),
                        event.currentIndex);

      if (this.todo.length <= (this.todoPage - 1) * 5 && this.todoPage > 0) {
        this.todoPage -= 1;
      }
    } else if(event.previousContainer.id === 'doneList') {
      // item came from done list
      transferArrayItem(this.done,
                        this.inProgress,
                        event.previousIndex + (5 * (this.donePage -1)),
                        event.currentIndex);

      if (this.done.length <= (this.donePage - 1) * 5 && this.donePage > 0) {
        this.donePage -= 1;
      }
    }
  }

  doneDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.done, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(this.inProgress,
                        this.done,
                        event.previousIndex + (5 * (this.donePage -1)),
                        event.currentIndex);

        if(this.inProgress.length <= (this.doPage - 1) * 5 && this.doPage > 0) {
          this.doPage -= 1;
        }
      }
  }

  private populateSprints() {
    // initialize component level sprints variable
    this.sprints = [];

    // get all teams the user is connected to
    this.projectService.getUserTeams(this.projectID, this.userID)
      .subscribe(
        teamData => {
          for(let i = 0; i < teamData.body['length']; i++) {
            this.projectService.getTeamSprints(teamData.body[i]['_id'])
              .subscribe(
                sprintData => {
                  for(let j = 0; j < sprintData.body['length']; j++) {
                    const sprint = new Sprint(
                      this.projectID,
                      sprintData.body[j]['teamID'],
                      sprintData.body[j]['name'],
                      sprintData.body[j]['issues'],
                      sprintData.body[j]['_id']
                    );

                    this.sprints.push(sprint);
                  }

                  // update loading state
                  this.sprintsLoading = false;
                }
              )
          }
        }, error => {
          // error in retrieving teams
          this.error.next(error.message);
        }
      )
  }

  private populateIssueStructs() {
    this.focusedSprint.issues.forEach((issue) => {
      switch (issue.state) {
        case 1: {
          this.todo.push(issue);
          break;
        }
        case 2: {
          this.inProgress.push(issue);
          break;
        }
        case 3: {
          this.done.push(issue);
          break;
        }
        default: {
          this.todo.push(issue);
          break;
        }
      }
    });
  }

  private depopulateIssueStructs() {
    this.todo = [];
    this.inProgress = [];
    this.done = [];
  }
}

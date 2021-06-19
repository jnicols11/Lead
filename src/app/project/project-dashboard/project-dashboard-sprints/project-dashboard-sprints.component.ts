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

      // update state of issue
      this.focusedSprint.issues.forEach((element, index) => {
        if (element.id == event.item.data.id) {
          this.focusedSprint.issues[index].userID = undefined;
          this.focusedSprint.issues[index].state = 1;
        }
      });

      // make http req to update sprint
      this.projectService.updateSprint(this.focusedSprint)
        .subscribe(
          () => { }, error => {
            this.error.next(error.message);
          }
        )
    }
  }

  doDrop(event: CdkDragDrop<string[]>, issue: Issue) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.inProgress, event.previousIndex, event.currentIndex);
    } else if(event.previousContainer.id === 'todoList') {
      // item came from todo list
      transferArrayItem(this.todo,
                        this.inProgress,
                        event.previousIndex + (5 * (this.todoPage - 1)),
                        event.currentIndex);

      // Check if page needs to be updated
      if (this.todo.length <= (this.todoPage - 1) * 5 && this.todoPage > 0) {
        this.todoPage -= 1;
      }

      // update state of issue
      this.focusedSprint.issues.forEach((element, index) => {
        if (element.id == event.item.data.id) {
          this.focusedSprint.issues[index].userID = this.userID;
          this.focusedSprint.issues[index].state = 2;
        }
      });

      // make http req to update sprint
      this.projectService.updateSprint(this.focusedSprint)
        .subscribe(
          () => { }, error => {
            this.error.next(error.message);
          }
        )
    } else if(event.previousContainer.id === 'doneList') {
      // item came from done list
      transferArrayItem(this.done,
                        this.inProgress,
                        event.previousIndex + (5 * (this.donePage -1)),
                        event.currentIndex);

      // Check if page needs to be updated
      if (this.done.length <= (this.donePage - 1) * 5 && this.donePage > 0) {
        this.donePage -= 1;
      }

      // update state of issue
      this.focusedSprint.issues.forEach((element, index) => {
        if (element.id == event.item.data.id) {
          this.focusedSprint.issues[index].userID = this.userID;
          this.focusedSprint.issues[index].state = 2;
        }
      });

      // make http req to update sprint
      this.projectService.updateSprint(this.focusedSprint)
        .subscribe(
          () => { }, error => {
            this.error.next(error.message);
          }
        )
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

        // Check if page needs to be updated
        if(this.inProgress.length <= (this.doPage - 1) * 5 && this.doPage > 0) {
          this.doPage -= 1;
        }

        // update state of issue
        this.focusedSprint.issues.forEach((element, index) => {
          if (element.id == event.item.data.id) {
            this.focusedSprint.issues[index].userID = undefined;
            this.focusedSprint.issues[index].state = 3;
          }
        });

        // make http req to update sprint
        this.projectService.updateSprint(this.focusedSprint)
          .subscribe(
            () => { }, error => {
              this.error.next(error.message);
            }
          )
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

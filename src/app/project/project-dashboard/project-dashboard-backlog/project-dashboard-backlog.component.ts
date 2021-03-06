import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { ThrowStmt } from '@angular/compiler';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ProjectHttpService } from '../../project-http.service';
import { Issue } from '../models/issue.model';
import { Sprint } from '../models/sprint.model';
import { Team } from '../models/team.model';

@Component({
  selector: 'app-project-dashboard-backlog',
  templateUrl: './project-dashboard-backlog.component.html',
  styleUrls: ['./project-dashboard-backlog.component.scss']
})
export class ProjectDashboardBacklogComponent implements OnInit {
  issuesLoading = true;
  issueLoading = false;
  sprintLoading = false;
  createIssue = false;
  createSprint = false;
  completedIssues = false;
  editName = false;
  editDesc = false;
  editTime = false;
  projectID: string;
  issueName: string;
  issueDesc: string;
  userRole: string;
  issueTime: number;
  issues: Issue[] = [];
  doneIssues: Issue[] = [];
  issuesSprint: Issue[] = [];
  issuePopup: Issue = null;
  teams: Team[];
  team: Team;
  issueForm: FormGroup;
  sprintForm: FormGroup;
  error = new Subject<string>();
  pageNumber = 1;
  sprintPageNumber = 1;
  donePageNumber = 1;

  constructor(
    private projectService: ProjectHttpService,
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

    // set user role for permissions
    this.userRole = localStorage.getItem('userProjectRole');

    if (this.userRole != 'member') {
      // populate teams
      this.populateTeams();
    }

    // populate issues
    this.populateIssues();

    // populate done issues
    this.populateCompletedIssues();
  }

  setPageNumber(num: number) {
    this.pageNumber = num;
  }

  setSprintPageNumber(num: number) {
    this.sprintPageNumber = num;
  }

  issueDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.issues, event.previousIndex + (5 * (this.pageNumber -1)), event.currentIndex + (5 * (this.pageNumber -1)));
    } else {
      transferArrayItem(this.issuesSprint,
                        this.issues,
                        event.previousIndex,
                        event.currentIndex + (5 * (this.pageNumber -1)));

      if (this.issuesSprint.length <= (this.sprintPageNumber - 1) * 4 && this.sprintPageNumber > 0) {
        this.sprintPageNumber = this.sprintPageNumber - 1;
      }
    }
  }

  sprintDrop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(this.issuesSprint, event.previousIndex, event.currentIndex);
    } else {
      transferArrayItem(this.issues,
                        this.issuesSprint,
                        event.previousIndex + (5 * (this.pageNumber -1)),
                        event.currentIndex);

      if (this.issues.length <= (this.pageNumber - 1) * 5 && this.pageNumber > 0) {
        this.pageNumber -= 1;
      }
    }
  }

  completedIssueDrop(event: CdkDragDrop<string[]>) {
    moveItemInArray(this.doneIssues, event.previousIndex + (4 * (this.donePageNumber -1)), event.currentIndex + (4 * (this.donePageNumber -1)));
  }

  viewCompletedIssues() {
    this.completedIssues = true;
    this.createSprint = false;
    this.createIssue = false;
  }

  closeCompletedIssues() {
    this.completedIssues = false;
  }

  preCreateIssue() {
    this.createIssue = true;
    this.initIssueForm();
  }

  preCreateSprint() {
    this.initSprintForm();
    this.createSprint = true;
  }

  preEditName() {
    this.editName = true;
  }

  preEditDesc() {
    this.editDesc = true;
  }

  preEditTime() {
    this.editTime = true;
  }

  cancelCreateIssue() {
    this.createIssue = false;
    this.issueForm.reset();
  }

  cancelCreateSprint() {
    this.createSprint = false;
  }

  cancelEditName() {
    this.editName = false;
  }

  cancelEditDesc() {
    this.editDesc = false;
  }

  cancelEditTime() {
    this.editTime = false;
  }

  onSubmitIssue() {
    // set issueLoading state
    this.issueLoading = true;

    // submit issue data
    const backlogID = this.projectID;

    // populate issue model
    const issue = new Issue(
      this.projectID,
      this.issueForm.value.name,
      this.issueForm.value.desc,
      this.issueForm.value.time,
      backlogID
    );

    issue.state = 1;

    // send issue to service to be transfered & subscribe to response
    this.projectService.createIssue(issue)
      .subscribe(
        responseData => {
          // refresh issues array
          this.populateIssues();

          // update issue loading state
          this.issueLoading = false;

          // close popup
          this.cancelCreateIssue();
        }, error => {
          // TODO present issue error popup

          // update issue loading state
          this.issueLoading = false;

          this.error.next(error.message);
        }
      )
  }

  onSubmitSprint() {
    // set loading state
    this.sprintLoading = true;

    // populate sprint model
    const sprint = new Sprint(
      this.projectID,
      this.team,
      this.sprintForm.value['name'],
      this.issuesSprint,
      this.sprintForm.value['deadline']
    );

    // send sprint to project service
    this.projectService.createSprint(sprint)
      .subscribe(
        responseData => {
          // update status of each issue in sprint
          this.issuesSprint.forEach(issue => {
            issue.backlogID = '';
            issue.sprintID = responseData.body['_id'];

            // update issue in database
            this.projectService.updateIssue(issue)
              .subscribe(
                updateResponse => {
                  // success
                }, error => {
                  this.error.next(error.message);
                }
              )
          });

          this.issuesSprint = [];

          // update sprint loading state
          this.sprintLoading = false;
          this.cancelCreateSprint();
        }, error => {
          // update sprint loading state
          this.sprintLoading = false;

          // TODO Display Error Message
          this.error.next(error.message);
        }
      );
  }

  onEditName(issueName: string) {
    // check if name changed
    if (issueName == this.issuePopup.name) {
      // do nothing name did not change
      this.cancelEditName();
    } else {
      // name changed update name in database
      this.issuePopup.name = issueName;

      // update issue
      this.updateIssue();
    }
  }

  onEditDesc(issueDesc: string) {
    // check if description changed
    if (issueDesc == this.issuePopup.desc) {
      // do nothing description did not change
      this.cancelEditDesc();
    } else {
      // description changed update in database
      this.issuePopup.desc = issueDesc;

      // update issue
      this.updateIssue();
    }
  }

  onEditTime(issueTime: number) {
    // check if time changed
    if (issueTime == this.issuePopup.time) {
      // do nothing time did not change
      this.cancelEditTime();
    } else {
      // time changed attempt to update in DB
      this.issuePopup.time = issueTime;

      // update issue
      this.updateIssue();
    }
  }

  focusIssue(issue: Issue) {
    this.issuePopup = issue;
    this.issueName = issue.name;
    this.issueDesc = issue.desc;
    this.issueTime = issue.time;
  }

  deleteIssue(issue: Issue) {
    if(confirm("Are you sure you want to delete this issue?")) {
      // send delete request
      this.projectService.deleteIssue(issue)
        .subscribe(
          responseData => {
            // refresh the backlog
            this.populateIssues();

            // reload content
            location.reload();

          }, error => {
            this.error.next(error.message);
          }
        )
      // close issue popup
      this.closeIssue();
    }
  }

  closeIssue() {
    // close issue popup
    this.issuePopup = null;
  }

  private populateIssues() {
    this.projectService.getProjectBacklogIssues(this.projectID)
      .subscribe(
        responseData => {
          // update loading status
          this.issuesLoading = false;

          // clear array
          this.issues = [];

          // populate component issue array
          for(const index in responseData.body) {
            let issue = new Issue(
              responseData.body[index]['projectID'],
              responseData.body[index]['name'],
              responseData.body[index]['desc'],
              responseData.body[index]['time'],
              responseData.body[index]['backlogID']
            );

            issue.id = responseData.body[index]['_id'];
            issue.state = responseData.body[index]['state'];

            // push to local array
            this.issues.push(issue);
          }
        }, error => {
          // throw error message
          this.error.next(error.message);
        }
    );
  }

  private populateCompletedIssues() {
    this.projectService.getCompletedIssues(this.projectID)
      .subscribe(
        responseData => {

          // clear array
          this.doneIssues = [];

          // populate done issues array
          for(const index in responseData.body) {
            let issue = new Issue(
              responseData.body[index]['projectID'],
              responseData.body[index]['name'],
              responseData.body[index]['desc'],
              responseData.body[index]['time'],
              responseData.body[index]['backlogID']
            );

            issue.id = responseData.body[index]['_id'];
            issue.state = responseData.body[index]['state'];
            
            // push to local array
            this.doneIssues.push(issue);
          }
        }, error => {
          // throw error message
          this.error.next(error.message);
        }
      )
  }

  private initIssueForm() {
    this.issueForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'desc': new FormControl(null),
      'time': new FormControl(null, [Validators.required, Validators.min(1)])
    });
  }

  private initSprintForm() {
    this.sprintForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'deadline': new FormControl(null, Validators.required)
    });
  }

  private updateIssue() {
    this.projectService.updateIssue(this.issuePopup)
        .subscribe(
          () => {
            // intentional for subscription
          },
          error => {
            this.error.next(error.message);
          }
        );
  }

  private populateTeams() {
    this.teams = [];

    this.projectService.getAllTeams(this.projectID)
      .subscribe(
        teamData => {
          for(let i = 0; i < teamData.body['length']; i++) {
            const team = new Team(
              this.projectID,
              teamData.body[i]['name'],
              teamData.body[i]['leader'],
              teamData.body[i]['members'],
              teamData.body[i]['_id']
            );

            this.teams.push(team);
          }
          this.team = this.teams[0];
        }, error => {
          this.error.next(error.message);
        }
      )
  }
}

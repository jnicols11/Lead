import { CdkDragDrop, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ProjectHttpService } from '../../project-http.service';
import { Issue } from '../models/issue.model';
import { Sprint } from '../models/sprint.model';

@Component({
  selector: 'app-project-dashboard-backlog',
  templateUrl: './project-dashboard-backlog.component.html',
  styleUrls: ['./project-dashboard-backlog.component.scss']
})
export class ProjectDashboardBacklogComponent implements OnInit {
  issuesLoading = true;
  sprintLoading = false;
  createIssue = false;
  createSprint = false;
  editName = false;
  editDesc = false;
  editTime = false;
  projectID: string;
  issueName: string;
  issueDesc: string;
  issueTime: number;
  issues: Issue[] = [];
  issuesSprint: Issue[] = [];
  issuePopup: Issue = null;
  issueForm: FormGroup;
  sprintForm: FormGroup;
  error = new Subject<string>();
  pageNumber = 1;
  sprintPageNumber = 1;

  constructor(private projectService: ProjectHttpService, private route: ActivatedRoute) { }

  ngOnInit(): void {
    // Set ProjectID
    this.route.queryParams
      .subscribe(
        params => {
          this.projectID = params['id'];
        }
      );

    // populate issues
    this.populateIssues();
  }

  incrementPageNumber() {
    this.pageNumber++;
  }

  decrementPageNumber() {
    this.pageNumber--;
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

      if (this.issuesSprint.length <= this.sprintPageNumber * 5) {
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

      if (this.issues.length <= this.pageNumber * 5) {
        this.pageNumber = this.pageNumber - 1;
      }
    }
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

    // send issue to service to be transfered & subscribe to response
    this.projectService.createIssue(issue)
      .subscribe(
        responseData => {
          // refresh issues array
          this.populateIssues();

          // close popup
          this.cancelCreateIssue();
        }, error => {
          this.error.next(error.message);
        }
      )
  }

  onSubmitSprint() {
    this.sprintLoading = true;

    // populate sprint model
    const sprint = new Sprint(
      this.projectID,
      localStorage.getItem('currentUser'),
      this.sprintForm.value['name'],
      this.issuesSprint
    );

    // send sprint to project service
    this.projectService.createSprint(sprint)
      .subscribe(
        responseData => {
          console.log(responseData);

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
          this.sprintLoading = false;
        }, error => {
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

            // push to local array
            this.issues.push(issue);
          }
        }, error => {
          // throw error message
          this.error.next(error.message);
        }
    );
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
      'name': new FormControl(null, Validators.required)
    });
  }

  private updateIssue() {
    this.projectService.updateIssue(this.issuePopup)
        .subscribe(
          responseData => {
            console.log(responseData);
          }, error => {
            this.error.next(error.message);
          }
        );
  }
}

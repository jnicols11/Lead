import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { ProjectHttpService } from '../../project-http.service';
import { Issue } from '../models/issue.model';

@Component({
  selector: 'app-project-dashboard-backlog',
  templateUrl: './project-dashboard-backlog.component.html',
  styleUrls: ['./project-dashboard-backlog.component.scss']
})
export class ProjectDashboardBacklogComponent implements OnInit {
  issuesLoading = true;
  createIssue = false;
  createSprint = false;
  editName = false;
  editDesc = false;
  editTime = false;
  projectID: string;
  issues: Issue[] = [];
  issuePopup: Issue = null;
  issueForm: FormGroup;
  error = new Subject<string>();

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

  preCreateIssue() {
    this.createIssue = true;
    this.initIssueForm();
  }

  preCreateSprint() {
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
    // submit sprint data
  }

  focusIssue(issue: Issue) {
    this.issuePopup = issue;
  }

  deleteIssue(issue: Issue) {
    // send delete request
    this.projectService.deleteIssue(issue)
      .subscribe(
        responseData => {
          // refresh the backlog
          this.populateIssues();
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
}

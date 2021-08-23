import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserHttpService } from 'src/app/user/user-http.service';
import { ProjectHttpService } from '../../project-http.service';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-dashboard-manage',
  templateUrl: './project-dashboard-manage.component.html',
  styleUrls: ['./project-dashboard-manage.component.scss']
})
export class ProjectDashboardManageComponent implements OnInit {
  loading = true;
  addUserLoading = false;
  addUserSuccess = false;
  addUserFail = false;
  addUserError = false;
  editName = false;
  editDesc = false;
  editDeadline = false;
  userExists = false;
  inputProjectName: string;
  inputProjectDesc: string;
  inputProjectDeadline: string;
  inputAddUser: string = '';
  addedName: string;
  inputDeleteName: string;
  deadline: string;
  userRole: string;
  project: Project = new Project;
  error = new Subject<string>();

  constructor(
    private projectService: ProjectHttpService,
    private userService: UserHttpService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
    ) { }

  ngOnInit(): void {
    this.userRole = localStorage.getItem('userProjectRole');
    this.route.queryParams
      .subscribe(
        params => {
          this.projectService.getProjectById(params['id'])
            .subscribe(
              responseData => {
                this.loading = false;
                this.project.name = responseData.body['name'];
                this.project.desc = responseData.body['desc'];
                this.project.deadline = responseData.body['deadline'];
                this.deadline = this.datePipe.transform(this.project.deadline, 'yyyy-MM-dd');
                this.project.userID = responseData.body['userID'];
                this.project.id = responseData.body['_id'];
                this.project.users = responseData.body['users'];
                this.inputProjectName = this.project.name;
                this.inputProjectDesc = this.project.desc;
                this.inputProjectDeadline = this.deadline;
              }, error => {
                this.error.next(error.message);
              }
            )
        }
      );
  }

  preEditName() {
    this.editName = true;
  }

  preEditDesc() {
    this.editDesc = true;
  }

  preEditDeadline() {
    this.editDeadline = true;
  }

  onEditName() {
    // check for change
    if (this.project.name === this.inputProjectName) {
      // nothing happended do nothing
      this.cancelEditName();
    } else {
      // update project name
      this.project.name = this.inputProjectName;

      // send http request to update in DB
      this.projectService.updateProject(this.project)
        .subscribe(
          responseData => {
            console.log(responseData);
          }, error => {
            this.error.next(error.message);
          }
        );
    }
  }

  onEditDesc() {
    // check for change
    if (this.project.desc === this.inputProjectDesc) {
      // nothing happended do nothing
      this.cancelEditDesc();
    } else {
      // update project description
      this.project.desc = this.inputProjectDesc;

      // send http request to update in DB
      this.projectService.updateProject(this.project)
        .subscribe(
          responseData => {
            console.log(responseData);
          }, error => {
            this.error.next(error.message);
          }
        );
    }
  }

  onEditDeadline() {
    // check for change
    if (this.deadline === this.inputProjectDeadline) {
      // nothing happended do nothing
      this.cancelEditDeadline();
    } else {
      // update project deadline
      this.project.deadline = new Date(this.inputProjectDeadline);

      // send http request to update in DB
      this.projectService.updateProject(this.project)
        .subscribe(
          responseData => {
            console.log(responseData);
          }, error => {
            this.error.next(error.message);
          }
        );
    }
  }

  cancelEditName() {
    this.editName = false;
  }

  cancelEditDesc() {
    this.editDesc = false;
  }

  cancelEditDeadline() {
    this.editDeadline = false;
  }

  closeUserExists() {
    this.userExists = false;
  }

  addUserToProject() {
    // set loading status
    this.addUserLoading = true;
    // find user by username or email
    this.userService.getUserByText(this.inputAddUser)
      .subscribe(
        responseData => {
          let match = false;
          this.project.users.forEach((element, index) => {
            if (this.project.users[index].id === +responseData.body['ID']) {
              // alert user already exists in project
              console.log('failed');
              this.addUserLoading = false;
              match = true;
              this.userExists = true;
            }
          });

          if (!match) {
             // add user project users list
            this.project.users.push({ id: responseData.body['ID'], role: 'member' });
            this.addedName = responseData.body['username'];

            // update project
            this.projectService.updateProject(this.project)
              .subscribe(
                newResponse => {
                  this.addUserLoading = false;
                  this.addUserSuccess = true;
                }, error => {
                  // present internal error to user
                  this.addUserError = true;
                  this.addUserLoading = false;

                  this.error.next(error.message);
                }
              );
          }

        }, error => {
          // present error to user no account was found
          this.addUserFail = true;
          this.addUserLoading = false;

          this.error.next(error.message);
        }
      )
  }

  manageProjectUsers() {
    this.router.navigate(['/project/manageUsers'], { queryParams: { id: this.project.id } });
  }

  deleteProject() {
    if(confirm("Are you sure you want to delete this project? All data will be gone")) {
      this.projectService.deleteProject(this.project.id)
        .subscribe(
          responseData => {
            this.router.navigate(['/projects']);
          }, error => {
            this.error.next(error.message);
          }
        )
    }
  }

  closePopups() {
    this.addUserError = false;
    this.addUserFail = false;
    this.addUserSuccess = false;
  }
}

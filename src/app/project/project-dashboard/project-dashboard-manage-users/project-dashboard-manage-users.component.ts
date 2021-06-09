import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserHttpService } from 'src/app/user/user-http.service';
import { User } from 'src/app/user/user.model';
import { ProjectHttpService } from '../../project-http.service';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-dashboard-manage-users',
  templateUrl: './project-dashboard-manage-users.component.html',
  styleUrls: ['./project-dashboard-manage-users.component.scss']
})
export class ProjectDashboardManageUsersComponent implements OnInit {
  users: User[] = [];
  focusedUser: User = null;
  projectID: string;
  loading = true;
  loadFailed = false;
  error = new Subject<string>();

  constructor(
    private projectService: ProjectHttpService,
    private userService: UserHttpService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(
        params => {
          this.projectID = params['id'];
          this.populateUsers();
        }
      )
  }

  onFocusUser(user: User) {
    this.focusedUser = user;
  }

  closeUserFocus() {
    this.focusedUser = null;
  }

  updateUserRole(role: string) {
    // update user role in database
    this.users.forEach(user => {
      if(user.id == this.focusedUser.id) {
        user.role = role;
      }
    });

    this.updateProject();

  }

  removeUserFromProject() {
    this.loading = true;
    this.projectService.getProjectById(this.projectID)
      .subscribe(
        projectData => {
          // get list of users
          const users = projectData.body['users'];

          // remove user from list
          users.forEach((element, index) => {
            if(element.id == this.focusedUser.id) users.splice(index,1);
          });

          //update list in database
          this.updateProjectUsers(users);

          // reset focus
          this.focusedUser = null;
        }, error => {
          this.error.next(error.message);
        }
      );
  }

  private populateUsers() {
    this.users = [];
    this.projectService.getProjectById(this.projectID)
      .subscribe(
        projectData => {
          const users = projectData.body['users'];
          users.forEach(id => {
            this.userService.getUser(id.id)
              .subscribe(
                userData => {
                  // populate user model
                  let user = new User(
                    userData.body['fullName'],
                    userData.body['username'],
                    userData.body['email'],
                    null,
                    userData.body['ID'],
                    id.role
                  );

                  // push user to component user array
                  this.users.push(user);
                  this.loading = false;
                }, error => {
                  this.error.next(error.message);
                }
              )
          });
        }, error => {
          this.loading = false;
          this.loadFailed = true;
          this.error.next(error.message);
        }
      );
  }

  private updateProject() {
    const project: Project = new Project;

    this.projectService.getProjectById(this.projectID)
      .subscribe(
        projectData => {
          project.name = projectData.body['name'];
          project.desc = projectData.body['desc'];
          project.deadline = projectData.body['deadline'];
          project.userID = projectData.body['userID'];
          project.id = projectData.body['_id'];

          project.users = this.users;

          this.projectService.updateProject(project)
            .subscribe(
              responseData => {
                // success!!
              }, error => {
                this.error.next(error.message);
              }
            );
        }, error => {
          this.error.next(error.message);
        }
      );
  }

  private updateProjectUsers(users: { id: number, role: string }[]) {
    const project: Project = new Project;

    this.projectService.getProjectById(this.projectID)
      .subscribe(
        projectData => {
          project.name = projectData.body['name'];
          project.desc = projectData.body['desc'];
          project.deadline = projectData.body['deadline'];
          project.userID = projectData.body['userID'];
          project.id = projectData.body['_id'];

          project.users = users;

          this.projectService.updateProject(project)
            .subscribe(
              responseData => {

                // update list on screen
                this.populateUsers();
              }, error => {
                this.error.next(error.message);
              }
            );
        }, error => {
          this.error.next(error.message);
        }
      );
  }
}

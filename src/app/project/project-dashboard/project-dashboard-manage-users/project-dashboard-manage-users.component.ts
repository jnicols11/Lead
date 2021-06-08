import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { UserHttpService } from 'src/app/user/user-http.service';
import { User } from 'src/app/user/user.model';
import { ProjectHttpService } from '../../project-http.service';

@Component({
  selector: 'app-project-dashboard-manage-users',
  templateUrl: './project-dashboard-manage-users.component.html',
  styleUrls: ['./project-dashboard-manage-users.component.scss']
})
export class ProjectDashboardManageUsersComponent implements OnInit {
  users: User[] = [];
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
          this.projectService.getProjectById(params['id'])
            .subscribe(
              projectData => {
                const users = projectData.body['users'];
                users.forEach(id => {
                  this.userService.getUser(+id)
                    .subscribe(
                      userData => {
                        // populate user model
                        let user = new User(
                          userData.body['fullName'],
                          userData.body['username'],
                          userData.body['email'],
                          null,
                          userData.body['ID']
                        );

                        // push user to component user array
                        this.users.push(user);
                      }, error => {
                        this.error.next(error.message);
                      }
                    )
                });

                this.loading = false;
              }, error => {
                this.loading = false;
                this.loadFailed = true;
                this.error.next(error.message);
              }
            )
        }
      )
  }

}

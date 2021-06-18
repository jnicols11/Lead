import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { UserHttpService } from 'src/app/user/user-http.service';
import { ProjectHttpService } from '../../project-http.service';
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
  }

  unfocusSprint() {
    this.focusedSprint = null;
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
}

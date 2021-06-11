import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subject } from 'rxjs';
import { UserHttpService } from 'src/app/user/user-http.service';
import { User } from 'src/app/user/user.model';
import { ProjectHttpService } from '../../project-http.service';
import { Team } from '../models/team.model';

@Component({
  selector: 'app-project-dashboard-teams',
  templateUrl: './project-dashboard-teams.component.html',
  styleUrls: ['./project-dashboard-teams.component.scss']
})
export class ProjectDashboardTeamsComponent implements OnInit {
  teams: Team[];
  users: User[];
  focusedTeam: Team = null;
  createTeam = false;
  selectLeader = false;
  selectMembers = false;
  userID: number;
  userRole: string;
  projectID: string;
  teamName: string = null;
  teamLeader: number = null;
  teamMembers: number[] = [];
  error = new Subject<string>();

  constructor(
    private projectService: ProjectHttpService,
    private userService: UserHttpService,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    // set user role and id
    this.userRole = localStorage.getItem('userProjectRole');
    this.userID = +localStorage.getItem('currentUser');

    // set project ID
    this.route.queryParams
      .subscribe(
        params => {
          this.projectID = params['id'];
        }
      )

    // populate teams array
    if(this.userRole == 'member') {
      // get teams the user is affiliated with
      this.populateUserTeams();
    } else {
      // get all teams
      this.populateTeams();
    }

    // populate users array
    this.populateUsers();
  }

  preCreateTeam() {
    this.createTeam = true;
    this.focusedTeam = null;
    this.selectLeader = false;
    this.selectMembers = false;
    this.teamName = null;
    this.teamLeader = null;
    this.teamMembers = [];
  }

  preSelectLeader() {
    this.selectLeader = true;
    this.createTeam = false;
    this.selectMembers = false;
  }

  preSelectMembers() {
    this.selectMembers = true;
    this.createTeam = false;
    this.selectLeader = false;
  }

  onCreateTeam() {
    const team = new Team(
      this.projectID,
      this.teamName,
      this.teamLeader,
      this.teamMembers
    );

    this.projectService.createTeam(team)
      .subscribe(
        responseData => {
          console.log(responseData);
        }, error => {
          this.error.next(error.message);
        }
      )
  }

  onFocusTeam(team: Team) {
    this.focusedTeam = team;
    this.createTeam = false;
  }

  onSelectLeader(user: User) {
    this.teamLeader = user.id;
  }

  onSelectMember(user: User) {
    let done = false;
    if(this.teamMembers.length == 0 && user.id != this.teamLeader) {
      this.teamMembers.push(user.id);
    } else {
      this.teamMembers.forEach((member, index) => {
        if(member == user.id) {
          // remove user from teamMembers and return
          this.teamMembers.splice(index, 1);
          done = true;
        }
      });

      if(!done && user.id != this.teamLeader) {
        // add user to teamMembers
        this.teamMembers.push(user.id);
      }
    }
  }

  cancelFocusTeam() {
    this.focusedTeam = null;
  }

  cancelCreateTeam() {
    this.createTeam = false;
  }

  cancelSelectLeader() {
    this.selectLeader = false;
    this.createTeam = true;
  }

  cancelSelectMembers() {
    this.selectMembers = false;
    this.createTeam = true;
  }

  private populateTeams() {
    this.projectService.getAllTeams(this.projectID);
  }

  private populateUserTeams() {
    this.projectService.getUserTeams(this.projectID, this.userID);
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
                }, error => {
                  this.error.next(error.message);
                }
              )
          });
        }, error => {
          this.error.next(error.message);
        }
      );
  }
}

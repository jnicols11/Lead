import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
  focusedTeam: Team = null;
  createTeam = false;
  selectLeader = false;
  selectMembers = false;
  userID: number;
  userRole: string;
  projectID: string;
  teamName: string = null;
  teamLeader: User = null;
  teamMembers: User[] = [];

  constructor(
    private projectService: ProjectHttpService,
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
      this.projectService.getUserTeams(this.projectID, this.userID);
    } else {
      // get all teams
      this.projectService.getAllTeams(this.projectID);
    }
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
    // todo
  }

  onFocusTeam(team: Team) {
    this.focusedTeam = team;
    this.createTeam = false;
  }

  onSelectLeader() {
    // todo
  }

  onSelectMembers() {
    // todo
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
}

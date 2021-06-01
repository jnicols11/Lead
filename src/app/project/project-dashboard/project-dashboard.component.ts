import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectHttpService } from '../project-http.service';

@Component({
  selector: 'app-project-dashboard',
  templateUrl: './project-dashboard.component.html',
  styleUrls: ['./project-dashboard.component.scss']
})
export class ProjectDashboardComponent implements OnInit {
  projectID: string

  constructor(private projectService: ProjectHttpService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit(): void {
    this.route.queryParams
      .subscribe(params => {
        this.projectID = params.id;
      })
  }

  goToBacklog() {
    this.router.navigate(['/project/backlog'], { queryParams: { id: this.projectID } });
  }

  goToSprints() {
    this.router.navigate(['/project/sprints'], { queryParams: { id: this.projectID } });
  }

  goToReports() {
    this.router.navigate(['/project/reports'], { queryParams: { id: this.projectID } });
  }

  goToManage() {
    this.router.navigate(['/project/manage'], { queryParams: { id: this.projectID } });
  }

}

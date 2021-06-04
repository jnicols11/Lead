import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProjectHttpService } from '../../project-http.service';
import { Project } from '../../project.model';

@Component({
  selector: 'app-project-dashboard-manage',
  templateUrl: './project-dashboard-manage.component.html',
  styleUrls: ['./project-dashboard-manage.component.scss']
})
export class ProjectDashboardManageComponent implements OnInit {
  loading = true;
  project: Project = new Project;
  inputDeleteName: string;
  deadline: string;
  error = new Subject<string>();

  constructor(
    private projectService: ProjectHttpService,
    private route: ActivatedRoute,
    private router: Router,
    private datePipe: DatePipe
    ) { }

  ngOnInit(): void {
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
              }, error => {
                this.error.next(error.message);
              }
            )
        }
      );
  }

  deleteProject() {
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

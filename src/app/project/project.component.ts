import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { ProjectHttpService } from './project-http.service';
import { Project } from './project.model';

@Component({
  selector: 'app-project',
  templateUrl: './project.component.html',
  styleUrls: ['./project.component.scss']
})
export class ProjectComponent implements OnInit {
  projectForm: FormGroup;
  error = new Subject<string>();
  createProject = false;
  projectsLoading = true;
  projects: Project[] = [];

  constructor(private projectService: ProjectHttpService, private router: Router) { }

  ngOnInit(): void {
    this.projectService.getUserProjects(+localStorage.getItem('currentUser'))
    .subscribe(responseData => {
      console.log(responseData);
      for(let i = 0; i < responseData.body['length']; i++) {
        const name = responseData.body[i].name;
        const desc = responseData.body[i].desc;
        const deadline = responseData.body[i].deadline;
        const userID = responseData.body[i].userID;
        const id = responseData.body[i]._id;

        const project = new Project(+userID, name, desc, deadline, id);
        this.projects.push(project);
      }
      this.projectsLoading = false;
    }, error => {
      this.error.next(error.message);
    });
  }

  onSubmit() {
    const userID: number = +localStorage.getItem('currentUser');
    const name = this.projectForm.value['name'];
    const desc = this.projectForm.value['desc'];
    const deadline = this.projectForm.value['deadline'];

    const project = new Project(userID, name, desc, deadline);

    this.projectService.createProject(project)
    .subscribe(
      responseData => {
        console.log(responseData);
        this.createProject = false;
        location.reload();
      }, error => {
        this.error.next(error.message);
      }
    )
  }

  onPreCreateProject() {
    this.createProject = true;
    this.initForm();
  }

  cancelCreateProject() {
    this.createProject = false;
  }

  goToProject(projectID: String) {
    console.log(projectID);
  }

  private initForm() {
    this.projectForm = new FormGroup({
      'name': new FormControl(null, Validators.required),
      'desc': new FormControl(null),
      'deadline': new FormControl(null, Validators.required)
    })
  }

}

import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProjectDashboardBacklogComponent } from './project/project-dashboard/project-dashboard-backlog/project-dashboard-backlog.component';
import { ProjectDashboardManageUsersComponent } from './project/project-dashboard/project-dashboard-manage-users/project-dashboard-manage-users.component';
import { ProjectDashboardManageComponent } from './project/project-dashboard/project-dashboard-manage/project-dashboard-manage.component';
import { ProjectDashboardReportsComponent } from './project/project-dashboard/project-dashboard-reports/project-dashboard-reports.component';
import { ProjectDashboardSprintsComponent } from './project/project-dashboard/project-dashboard-sprints/project-dashboard-sprints.component';
import { ProjectDashboardComponent } from './project/project-dashboard/project-dashboard.component';
import { ProjectComponent } from './project/project.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegComponent } from './user/user-reg/user-reg.component';
import { UserComponent } from './user/user.component';

const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'projects', component: ProjectComponent },
  { path: 'project', component: ProjectDashboardComponent, children: [
    { path: 'backlog', component: ProjectDashboardBacklogComponent },
    { path: 'sprints', component: ProjectDashboardSprintsComponent },
    { path: 'reports', component: ProjectDashboardReportsComponent },
    { path: 'manage', component: ProjectDashboardManageComponent },
    { path: 'manageUsers', component: ProjectDashboardManageUsersComponent }
  ] },
  { path: 'register', component: UserRegComponent },
  { path: 'login', component: UserLoginComponent },
  { path: 'account', component: UserComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

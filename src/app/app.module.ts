import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { HeaderComponent } from './header/header.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { ProjectComponent } from './project/project.component';
import { UserComponent } from './user/user.component';
import { UserLoginComponent } from './user/user-login/user-login.component';
import { UserRegComponent } from './user/user-reg/user-reg.component';
import { ClickOutsideModule } from 'ng-click-outside';
import { NgxPaginationModule } from 'ngx-pagination';
import { ProjectDashboardComponent } from './project/project-dashboard/project-dashboard.component';
import { ProjectDashboardBacklogComponent } from './project/project-dashboard/project-dashboard-backlog/project-dashboard-backlog.component';
import { ProjectDashboardSprintsComponent } from './project/project-dashboard/project-dashboard-sprints/project-dashboard-sprints.component';
import { ProjectDashboardReportsComponent } from './project/project-dashboard/project-dashboard-reports/project-dashboard-reports.component';
import { ProjectDashboardManageComponent } from './project/project-dashboard/project-dashboard-manage/project-dashboard-manage.component';
import { DatePipe } from '@angular/common';
import { ProjectDashboardManageUsersComponent } from './project/project-dashboard/project-dashboard-manage-users/project-dashboard-manage-users.component';
import { ProjectDashboardTeamsComponent } from './project/project-dashboard/project-dashboard-teams/project-dashboard-teams.component';
import { MDBBootstrapModule } from 'angular-bootstrap-md';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { IvyCarouselModule } from 'angular-responsive-carousel';

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    HeaderComponent,
    ProjectComponent,
    UserComponent,
    UserLoginComponent,
    UserRegComponent,
    ProjectDashboardComponent,
    ProjectDashboardBacklogComponent,
    ProjectDashboardSprintsComponent,
    ProjectDashboardReportsComponent,
    ProjectDashboardManageComponent,
    ProjectDashboardManageUsersComponent,
    ProjectDashboardTeamsComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    AppRoutingModule,
    NgxPaginationModule,
    ClickOutsideModule,
    DragDropModule,
    NgbModule,
    IvyCarouselModule
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }

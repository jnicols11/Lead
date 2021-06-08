import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardManageUsersComponent } from './project-dashboard-manage-users.component';

describe('ProjectDashboardManageUsersComponent', () => {
  let component: ProjectDashboardManageUsersComponent;
  let fixture: ComponentFixture<ProjectDashboardManageUsersComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardManageUsersComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardManageUsersComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

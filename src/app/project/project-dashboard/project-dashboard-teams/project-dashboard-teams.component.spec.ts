import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardTeamsComponent } from './project-dashboard-teams.component';

describe('ProjectDashboardTeamsComponent', () => {
  let component: ProjectDashboardTeamsComponent;
  let fixture: ComponentFixture<ProjectDashboardTeamsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardTeamsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardTeamsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardReportsComponent } from './project-dashboard-reports.component';

describe('ProjectDashboardReportsComponent', () => {
  let component: ProjectDashboardReportsComponent;
  let fixture: ComponentFixture<ProjectDashboardReportsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardReportsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardReportsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

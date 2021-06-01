import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardSprintsComponent } from './project-dashboard-sprints.component';

describe('ProjectDashboardSprintsComponent', () => {
  let component: ProjectDashboardSprintsComponent;
  let fixture: ComponentFixture<ProjectDashboardSprintsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardSprintsComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardSprintsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

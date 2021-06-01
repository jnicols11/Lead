import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardBacklogComponent } from './project-dashboard-backlog.component';

describe('ProjectDashboardBacklogComponent', () => {
  let component: ProjectDashboardBacklogComponent;
  let fixture: ComponentFixture<ProjectDashboardBacklogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardBacklogComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardBacklogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

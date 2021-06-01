import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectDashboardManageComponent } from './project-dashboard-manage.component';

describe('ProjectDashboardManageComponent', () => {
  let component: ProjectDashboardManageComponent;
  let fixture: ComponentFixture<ProjectDashboardManageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProjectDashboardManageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProjectDashboardManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

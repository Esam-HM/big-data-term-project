import { ComponentFixture, TestBed } from '@angular/core/testing';

import { JobWorkerComponent } from './job-worker.component';

describe('JobWorkerComponent', () => {
  let component: JobWorkerComponent;
  let fixture: ComponentFixture<JobWorkerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [JobWorkerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(JobWorkerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});

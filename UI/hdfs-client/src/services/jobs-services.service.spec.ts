import { TestBed } from '@angular/core/testing';

import { JobsServicesService } from './jobs-services.service';

describe('JobsServicesService', () => {
  let service: JobsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JobsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

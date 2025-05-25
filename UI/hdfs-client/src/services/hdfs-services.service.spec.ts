import { TestBed } from '@angular/core/testing';

import { HdfsServicesService } from './hdfs-services.service';

describe('HdfsServicesService', () => {
  let service: HdfsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(HdfsServicesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { TrackingMotionService } from './tracking-motion.service';

describe('TrackingMotionService', () => {
  let service: TrackingMotionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TrackingMotionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

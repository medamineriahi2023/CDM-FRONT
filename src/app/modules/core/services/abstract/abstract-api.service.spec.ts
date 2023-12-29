import { TestBed } from '@angular/core/testing';

import { AbstractApiService } from './abstract-api.service';

describe('AbstractApiService', () => {
  let service: AbstractApiService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AbstractApiService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { SortieStockService } from './sortie-stock.service';

describe('SortieStockService', () => {
  let service: SortieStockService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SortieStockService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

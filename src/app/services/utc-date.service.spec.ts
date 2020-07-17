import { TestBed } from '@angular/core/testing';

import { UtcDateService } from './utc-date.service';

describe('UtcDateService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: UtcDateService = TestBed.get(UtcDateService);
    expect(service).toBeTruthy();
  });
});

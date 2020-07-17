import { TestBed } from '@angular/core/testing';

import { CustomHeadersService } from './custom-headers.service';

describe('CustomHeadersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CustomHeadersService = TestBed.get(CustomHeadersService);
    expect(service).toBeTruthy();
  });
});

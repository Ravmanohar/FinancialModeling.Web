import { TestBed } from '@angular/core/testing';

import { SharedmodelService } from './sharedmodel.service';

describe('SharedmodelService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SharedmodelService = TestBed.get(SharedmodelService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { ProjectionService } from './projection.service';

describe('ProjectionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ProjectionService = TestBed.get(ProjectionService);
    expect(service).toBeTruthy();
  });
});

import { TestBed } from '@angular/core/testing';

import { RucService } from './ruc.service';

describe('RucService', () => {
  let service: RucService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RucService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

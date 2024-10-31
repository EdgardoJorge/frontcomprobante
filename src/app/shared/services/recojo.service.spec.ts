import { TestBed } from '@angular/core/testing';

import { RecojoService } from './recojo.service';

describe('RecojoService', () => {
  let service: RecojoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RecojoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});

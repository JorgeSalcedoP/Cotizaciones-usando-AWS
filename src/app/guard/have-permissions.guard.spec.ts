import { TestBed, async, inject } from '@angular/core/testing';

import { HavePermissionsGuard } from './have-permissions.guard';

describe('HavePermissionsGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HavePermissionsGuard]
    });
  });

  it('should ...', inject([HavePermissionsGuard], (guard: HavePermissionsGuard) => {
    expect(guard).toBeTruthy();
  }));
});

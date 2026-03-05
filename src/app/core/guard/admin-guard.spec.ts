import { TestBed } from '@angular/core/testing';

import { adminGuard } from './admin-guard';
import { StorageService } from '../services/storage.service';

describe('adminGuard', () => {
  let hasRoleSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    hasRoleSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: { hasRole: hasRoleSpy } },
      ],
    });
  });

  it('should allow navigation when user has admin role', () => {
    hasRoleSpy.mockReturnValue(true);

    const canActivate = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );

    expect(canActivate).toBe(true);
    expect(hasRoleSpy).toHaveBeenCalledWith('ROLE_ADMIN');
  });

  it('should block navigation when user does not have admin role', () => {
    hasRoleSpy.mockReturnValue(false);

    const canActivate = TestBed.runInInjectionContext(() =>
      adminGuard({} as any, {} as any)
    );

    expect(canActivate).toBe(false);
    expect(hasRoleSpy).toHaveBeenCalledWith('ROLE_ADMIN');
  });
});


import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { authGuard } from './auth-guard';
import { StorageService } from '../services/storage.service';

describe('authGuard', () => {
  let isAuthenticatedSpy: ReturnType<typeof vi.fn>;
  let navigateByUrlSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    isAuthenticatedSpy = vi.fn();
    navigateByUrlSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: { isAuthenticated: isAuthenticatedSpy } },
        { provide: Router, useValue: { navigateByUrl: navigateByUrlSpy } },
      ],
    });
  });

  it('should allow navigation when user is authenticated', () => {
    isAuthenticatedSpy.mockReturnValue(true);

    const canActivate = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(canActivate).toBe(true);
    expect(navigateByUrlSpy).not.toHaveBeenCalled();
  });

  it('should redirect to login when user is not authenticated', () => {
    isAuthenticatedSpy.mockReturnValue(false);

    const canActivate = TestBed.runInInjectionContext(() =>
      authGuard({} as any, {} as any)
    );

    expect(canActivate).toBe(false);
    expect(navigateByUrlSpy).toHaveBeenCalledWith('/login');
  });
});


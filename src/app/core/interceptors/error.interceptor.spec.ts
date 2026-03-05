import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { throwError, of } from 'rxjs';

import { errorInterceptor } from './error.interceptor';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

describe('errorInterceptor', () => {
  let logoutSpy: ReturnType<typeof vi.fn>;
  let navigateSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    logoutSpy = vi.fn();
    navigateSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: { logout: logoutSpy } },
        { provide: Router, useValue: { navigate: navigateSpy } },
      ],
    });
  });

  it('should logout and redirect on 401/403 errors', () => {
    let receivedError: unknown;

    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const handler = () =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: 401,
              statusText: 'Unauthorized',
            }),
        );

      errorInterceptor(req, handler).subscribe({
        next: () => {
          /* no-op */
        },
        error: (err) => {
          receivedError = err;
        },
      });
    });

    expect(logoutSpy).toHaveBeenCalled();
    expect(navigateSpy).toHaveBeenCalledWith(['/login']);
    expect(receivedError).toBeInstanceOf(HttpErrorResponse);
  });

  it('should pass through non auth-related errors without logout', () => {
    let receivedError: unknown;

    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const handler = () =>
        throwError(
          () =>
            new HttpErrorResponse({
              status: 500,
              statusText: 'Server error',
            }),
        );

      errorInterceptor(req, handler).subscribe({
        next: () => {
          /* no-op */
        },
        error: (err) => {
          receivedError = err;
        },
      });
    });

    expect(logoutSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
    expect(receivedError).toBeInstanceOf(HttpErrorResponse);
  });

  it('should pass successful responses without modification', () => {
    let called = false;

    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      const handler = () => of({} as any);

      errorInterceptor(req, handler).subscribe({
        next: () => {
          called = true;
        },
      });
    });

    expect(called).toBe(true);
    expect(logoutSpy).not.toHaveBeenCalled();
    expect(navigateSpy).not.toHaveBeenCalled();
  });
});


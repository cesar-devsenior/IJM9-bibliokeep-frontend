import { TestBed } from '@angular/core/testing';
import { HttpRequest, HttpEvent } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { authInterceptor } from './auth.interceptor';
import { StorageService } from '../services/storage.service';

describe('authInterceptor', () => {
  let getTokenSpy: ReturnType<typeof vi.fn>;
  let nextSpy: (req: HttpRequest<any>) => Observable<HttpEvent<any>>;

  beforeEach(() => {
    getTokenSpy = vi.fn();
    nextSpy = vi.fn((req: HttpRequest<any>) =>
      of({} as HttpEvent<unknown>),
    ) as unknown as (req: HttpRequest<any>) => Observable<HttpEvent<any>>;

    TestBed.configureTestingModule({
      providers: [
        { provide: StorageService, useValue: { getToken: getTokenSpy } },
      ],
    });
  });

  it('should add Authorization header when token exists', () => {
    getTokenSpy.mockReturnValue('fake-token');

    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      authInterceptor(req, nextSpy).subscribe();
    });

    expect(getTokenSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledTimes(1);

    const calledReq: HttpRequest<unknown> = (nextSpy as any).mock.calls[0][0];
    expect(calledReq.headers.get('Authorization')).toBe('Bearer fake-token');
  });

  it('should not add Authorization header when there is no token', () => {
    getTokenSpy.mockReturnValue(null);

    TestBed.runInInjectionContext(() => {
      const req = new HttpRequest('GET', '/api/test');
      authInterceptor(req, nextSpy).subscribe();
    });

    expect(getTokenSpy).toHaveBeenCalled();
    expect(nextSpy).toHaveBeenCalledTimes(1);

    const calledReq: HttpRequest<unknown> = (nextSpy as any).mock.calls[0][0];
    expect(calledReq.headers.get('Authorization')).toBeNull();
  });
});


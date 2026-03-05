import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { AuthService } from './auth.service';
import { StorageService } from './storage.service';
import type { LoginCredentials } from '../models/login-credentials.model';
import type { AuthResponse } from '../models/auth-response.model';

describe('AuthService', () => {
  let httpPostSpy: ReturnType<typeof vi.fn>;
  let setTokenSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    httpPostSpy = vi.fn();
    setTokenSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        AuthService,
        { provide: HttpClient, useValue: { post: httpPostSpy } },
        {
          provide: StorageService,
          useValue: {
            setToken: setTokenSpy,
            removeToken: vi.fn(),
          },
        },
      ],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(AuthService);
    expect(service).toBeTruthy();
  });

  it('should call backend login and store token on success', () => {
    const service = TestBed.inject(AuthService);

    const credentials: LoginCredentials = {
      email: 'user@email.com',
      password: '123456',
    };

    const response: AuthResponse = {
      access_token: 'fake-token',
      // el resto de propiedades no son usadas en AuthService
    } as AuthResponse;

    httpPostSpy.mockReturnValue(of(response));

    let emitted: AuthResponse | null = null;
    service.login(credentials).subscribe((resp) => {
      emitted = resp;
    });

    expect(httpPostSpy).toHaveBeenCalledWith(
      'http://localhost:8080/auth/login',
      credentials
    );
    expect(setTokenSpy).toHaveBeenCalledWith('fake-token');
    expect(emitted).toEqual(response);
  });

  it('should clear token and currentUser on logout', () => {
    const service = TestBed.inject(AuthService);
    const storage = TestBed.inject(StorageService) as any;

    const removeTokenSpy = vi.spyOn(storage, 'removeToken');
    const currentUserSetSpy = vi.spyOn(service.currentUser, 'set');

    service.logout();

    expect(removeTokenSpy).toHaveBeenCalled();
    expect(currentUserSetSpy).toHaveBeenCalledWith(null);
  });
});


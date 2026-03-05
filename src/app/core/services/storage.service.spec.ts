import { StorageService } from './storage.service';

describe('StorageService', () => {
  let service: StorageService;
  let setItemSpy: ReturnType<typeof vi.fn>;
  let getItemSpy: ReturnType<typeof vi.fn>;
  let removeItemSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    setItemSpy = vi.fn();
    getItemSpy = vi.fn();
    removeItemSpy = vi.fn();

    const fakeStorage = {
      setItem: setItemSpy,
      getItem: getItemSpy,
      removeItem: removeItemSpy,
    } as unknown as Storage;

    service = new StorageService();
    // @ts-expect-error acceso a propiedad privada para poder mockear localStorage
    service.storage = fakeStorage;
  });

  it('should set, get and remove token', () => {
    service.setToken('abc');
    expect(setItemSpy).toHaveBeenCalledWith('token', 'abc');

    getItemSpy.mockReturnValue('abc');
    expect(service.getToken()).toBe('abc');

    service.removeToken();
    expect(removeItemSpy).toHaveBeenCalledWith('token');
  });

  it('should report authentication status based on token existence', () => {
    getItemSpy.mockReturnValue(null);
    expect(service.isAuthenticated()).toBe(false);

    getItemSpy.mockReturnValue('abc');
    expect(service.isAuthenticated()).toBe(true);
  });

  it('should decode email and roles from token for getEmail and hasRole', () => {
    // token JWT válido con payload:
    // { sub: 'user@example.com', roles: ['ROLE_USER','ROLE_ADMIN'], 'user-id': '123' }
    const validJwt =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.' +
      'eyJzdWIiOiJ1c2VyQGV4YW1wbGUuY29tIiwicm9sZXMiOlsiUk9MRV9VU0VSIiwiUk9MRV9BRE1JTiJdLCJ1c2VyLWlkIjoiMTIzIn0.' +
      'sig';

    getItemSpy.mockReturnValue(validJwt);

    expect(service.getEmail()).toBe('user@example.com');
    expect(service.hasRole('ROLE_ADMIN')).toBe(true);
    expect(service.hasRole('ROLE_UNKNOWN')).toBe(false);
  });
});


import { TestBed } from '@angular/core/testing';
import { ActivatedRoute, Router } from '@angular/router';
import { of } from 'rxjs';
import { MainLayoutComponent } from './main-layout.component';
import { AuthService } from '../../services/auth.service';
import { StorageService } from '../../services/storage.service';

describe('MainLayoutComponent', () => {
  let logoutSpy: ReturnType<typeof vi.fn>;
  let navigateSpy: ReturnType<typeof vi.fn>;
  let getEmailSpy: ReturnType<typeof vi.fn>;
  let hasRoleSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    logoutSpy = vi.fn();
    navigateSpy = vi.fn();
    getEmailSpy = vi.fn().mockReturnValue('user@example.com');
    hasRoleSpy = vi.fn().mockReturnValue(true);

    await TestBed.configureTestingModule({
      imports: [MainLayoutComponent],
      providers: [
        { provide: AuthService, useValue: { logout: logoutSpy } },
        {
          provide: Router,
          useValue: {
            navigateByUrl: navigateSpy,
            events: of(),
          },
        },
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
            url: of([]),
            params: of({}),
            queryParams: of({}),
            fragment: of(null),
          },
        },
        {
          provide: StorageService,
          useValue: {
            getEmail: getEmailSpy,
            hasRole: hasRoleSpy,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the main layout component', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should toggle mobile drawer, sidebar and profile menu', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    const component = fixture.componentInstance as any;

    component.openMobileDrawer();
    expect(component.isMobileDrawerOpen()).toBe(true);

    component.closeMobileDrawer();
    expect(component.isMobileDrawerOpen()).toBe(false);

    const initialSidebar = component.isSidebarCollapsed();
    component.toggleDesktopSidebar();
    expect(component.isSidebarCollapsed()).toBe(!initialSidebar);

    const initialProfile = component.isProfileMenuOpen();
    component.toggleProfileMenu();
    expect(component.isProfileMenuOpen()).toBe(!initialProfile);

    component.closeProfileMenu();
    expect(component.isProfileMenuOpen()).toBe(false);
  });

  it('should verify roles using storage service', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    const component = fixture.componentInstance as any;

    // sin roles siempre true
    expect(component.verifyRoles(undefined)).toBe(true);

    // con roles delega en storage.hasRole
    hasRoleSpy.mockReturnValueOnce(true).mockReturnValueOnce(false);
    const result = component.verifyRoles(['ROLE_ADMIN', 'ROLE_USER']);

    expect(hasRoleSpy).toHaveBeenCalledWith('ROLE_ADMIN');
    expect(hasRoleSpy).toHaveBeenCalledWith('ROLE_USER');
    expect(result).toBe(true);
  });

  it('should logout and navigate to login', () => {
    const fixture = TestBed.createComponent(MainLayoutComponent);
    const component = fixture.componentInstance as any;

    // abre el menú para comprobar que luego se cierra
    component.toggleProfileMenu();
    expect(component.isProfileMenuOpen()).toBe(true);

    component.logout();

    expect(logoutSpy).toHaveBeenCalled();
    expect(component.isProfileMenuOpen()).toBe(false);
    expect(navigateSpy).toHaveBeenCalledWith('/login');
  });
});


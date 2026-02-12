import { NgClass } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import {
  BookOpen,
  Handshake,
  LayoutDashboard,
  LucideAngularModule,
  Menu,
  type LucideIconData,
  X
} from 'lucide-angular';
import { StorageService } from '../../services/storage.service';

type NavItem = {
  label: string;
  route: string;
  icon: LucideIconData;
  roles?: string[];
};

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [NgClass, RouterLink, RouterLinkActive, RouterOutlet, LucideAngularModule],
  templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {
  protected readonly isMobileDrawerOpen = signal(false);
  protected readonly isSidebarCollapsed = signal(false);
  protected readonly isProfileMenuOpen = signal(false);

  protected readonly auth = inject(AuthService);
  protected readonly router = inject(Router);
  protected readonly storage = inject(StorageService);

  protected readonly userEmail = signal<string>(this.storage.getEmail());

  // Icon refs for <lucide-icon [img]="...">
  protected readonly Menu = Menu;
  protected readonly X = X;

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Biblioteca', route: '/library', icon: BookOpen },
    { label: 'Préstamos', route: '/loans', icon: Handshake, roles: ["ROLE_ADMIN"] }
  ];

  protected openMobileDrawer(): void {
    this.isMobileDrawerOpen.set(true);
  }

  protected closeMobileDrawer(): void {
    this.isMobileDrawerOpen.set(false);
  }

  protected toggleDesktopSidebar(): void {
    this.isSidebarCollapsed.update((v) => !v);
  }

  protected toggleProfileMenu(): void {
    this.isProfileMenuOpen.update(v => !v);
  }

  protected closeProfileMenu(): void {
    this.isProfileMenuOpen.set(false);
  }

  protected verifyRoles(roles?: string[]): boolean {
    if (!roles) {
      return true;
    }

    const existingRoles = roles.map(r => this.storage.hasRole(r))
      .filter(d => d)
      .length;
      
    return existingRoles >= 1;
  }

  protected logout(): void {
    this.auth.logout();
    this.closeProfileMenu();
    this.router.navigateByUrl("/login");
  }
}


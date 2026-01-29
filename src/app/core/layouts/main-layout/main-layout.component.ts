import { NgClass } from '@angular/common';
import { Component, signal } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import {
  BookOpen,
  Handshake,
  LayoutDashboard,
  LucideAngularModule,
  Menu,
  type LucideIconData,
  X
} from 'lucide-angular';

type NavItem = {
  label: string;
  route: string;
  icon: LucideIconData;
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

  // Icon refs for <lucide-icon [img]="...">
  protected readonly Menu = Menu;
  protected readonly X = X;

  protected readonly navItems: NavItem[] = [
    { label: 'Dashboard', route: '/dashboard', icon: LayoutDashboard },
    { label: 'Biblioteca', route: '/library', icon: BookOpen },
    { label: 'Préstamos', route: '/loans', icon: Handshake }
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
}


import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BookOpen, Handshake, LayoutDashboard, LucideAngularModule, Menu, X } from 'lucide-angular';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(),
    importProvidersFrom(
      LucideAngularModule.pick({
        Menu,
        X,
        LayoutDashboard,
        BookOpen,
        Handshake
      })
    ),
    provideRouter(routes)
  ]
};

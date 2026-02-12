import { ApplicationConfig, importProvidersFrom, provideBrowserGlobalErrorListeners } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideRouter } from '@angular/router';
import { BookOpen, Handshake, LayoutDashboard, LucideAngularModule, Menu, X } from 'lucide-angular';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { errorInterceptor } from './core/interceptors/error.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideHttpClient(
      withInterceptors([authInterceptor, errorInterceptor])
    ),
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

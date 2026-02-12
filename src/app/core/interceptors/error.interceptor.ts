import { inject } from '@angular/core';
import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { catchError } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const auth = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((error) => {
      if (
        error instanceof HttpErrorResponse &&
        (error.status === 401 || error.status === 403)
      ) {
        try {
          auth.logout();
        } catch (_) {}

        router.navigate(['/login']);
      }

      return throwError(() => error);
    })
  );
};

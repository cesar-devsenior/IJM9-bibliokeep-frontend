import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { jwtDecode } from 'jwt-decode';
import { TokenInformacion } from '../models/auth-response.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);

  return storage.hasRole("ROLE_ADMIN");
};

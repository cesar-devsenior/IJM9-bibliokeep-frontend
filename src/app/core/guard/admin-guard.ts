import { inject } from '@angular/core';
import { CanActivateFn } from '@angular/router';
import { StorageService } from '../services/storage.service';
import { jwtDecode } from 'jwt-decode';
import { TokenInformacion } from '../models/auth-response.model';

export const adminGuard: CanActivateFn = (route, state) => {
  const storage = inject(StorageService);

  const info = jwtDecode(storage.getToken() ?? '') as TokenInformacion;

  if(info.roles.filter(r => r === "ROLE_ADMIN").length === 1){
    return true;
  }
  return false;
};

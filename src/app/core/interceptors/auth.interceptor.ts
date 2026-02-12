import { inject } from "@angular/core";
import { HttpInterceptorFn } from "@angular/common/http";
import { StorageService } from "../services/storage.service";

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const storage = inject(StorageService);
  const token = storage.getToken();

  if (token) {
    const authReq = req.clone({
      headers: req.headers.set("Authorization", `Bearer ${token}`),
    });

    return next(authReq);
  }

  return next(req);
};

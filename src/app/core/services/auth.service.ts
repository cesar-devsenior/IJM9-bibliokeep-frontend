import { HttpClient } from "@angular/common/http";
import { inject, Injectable, signal } from "@angular/core";
import { StorageService } from "./storage.service";
import { LoginCredentials } from "../models/login-credentials.model";
import { AuthResponse } from "../models/auth-response.model";
import { User } from "../models/user.model";
import { catchError, Observable, tap } from "rxjs";

@Injectable({
    providedIn: "root"
})
export class AuthService {
    private http = inject(HttpClient);
    private storage = inject(StorageService);

    private baseUrl = "http://localhost:8080/auth";

    public currentUser = signal<User | null>(null);

    login(credentials: LoginCredentials): Observable<AuthResponse>{
        return this.http.post<AuthResponse>(`${this.baseUrl}/login`, credentials)
                .pipe(
                    tap(resp => this.storage.setToken(resp.access_token))
                );
    }

    logout(){
        this.storage.removeToken();
        this.currentUser.set(null);
    }
}
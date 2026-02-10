import { Injectable } from "@angular/core";

@Injectable({ providedIn: "root" })
export class StorageService {
    private TOKEN_KEY = "token";
    private storage = localStorage;

    setToken(token: string): void {
        this.storage.setItem(this.TOKEN_KEY, token);
    }

    getToken(): string | null {
        return this.storage.getItem(this.TOKEN_KEY);
    }

    removeToken(): void {
        this.storage.removeItem(this.TOKEN_KEY);
    } 

    isAuthenticated(): boolean {
        return this.getToken() !== null;
    }
}
import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Stats } from "../models/stats.model";

@Injectable({ providedIn: "root" })
export class StatsService {
    private http = inject(HttpClient);

    getStats(): Observable<Stats> {
        return this.http.get<Stats>('http://localhost:8080/api/stats/dashboard');
    }
}
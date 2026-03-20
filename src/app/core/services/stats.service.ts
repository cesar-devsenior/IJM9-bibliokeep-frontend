import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Stats } from "../models/stats.model";
import { environment } from "../../../environments/environment";

@Injectable({ providedIn: "root" })
export class StatsService {
    private readonly http = inject(HttpClient);

    getStats(): Observable<Stats> {
        return this.http.get<Stats>(`${environment.apiUrl}/api/stats/dashboard`);
    }
}
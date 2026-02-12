import { inject, Injectable, signal } from "@angular/core";
import { StatsService } from "../../../core/services/stats.service";
import { Stats } from "../../../core/models/stats.model";

@Injectable({ providedIn: 'root' })
export class StatsStoreService {
    private emptyStats : Stats = {
        totalBooks: 0,
        reading: 0,
        activeLoans: 0,
        returnedLoansThisYear: 0,
        annualGoal: 0,
        progressPercentage: 0
    };
    readonly stats = signal<Stats>(this.emptyStats);
    readonly isLoading = signal(false);

    private statsService = inject(StatsService);

    loadStats(): void {
        this.isLoading.set(true);
        this.statsService.getStats()
            .subscribe({
                next: (stats) => {
                    this.stats.set(stats);
                    this.isLoading.set(false);
                },
                error: (errors) => {
                    this.stats.set(this.emptyStats);
                    console.error('Ocurrió un problema al cargar los datos del dashboard:', errors);
                    this.isLoading.set(false);
                }
            });
    }
}
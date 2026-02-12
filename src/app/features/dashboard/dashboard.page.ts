import { Component, inject, OnInit } from '@angular/core';
import { StatsStoreService } from './store/stats-store.service';

@Component({
  selector: 'app-dashboard-page',
  standalone: true,
  templateUrl: './dashboard.page.html'
})
export class DashboardPage implements OnInit {
  protected readonly statsStorage = inject(StatsStoreService);

  ngOnInit(): void {
    this.statsStorage.loadStats();
  }
}


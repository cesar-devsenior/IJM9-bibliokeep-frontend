import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { StatsService } from './stats.service';
import type { Stats } from '../models/stats.model';

describe('StatsService', () => {
  let httpGetSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    httpGetSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        StatsService,
        { provide: HttpClient, useValue: { get: httpGetSpy } },
      ],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(StatsService);
    expect(service).toBeTruthy();
  });

  it('should get dashboard stats', () => {
    const service = TestBed.inject(StatsService);
    const stats: Stats = {
      totalBooks: 1,
      reading: 1,
      activeLoans: 0,
      returnedLoansThisYear: 0,
      annualGoal: 10,
      progressPercentage: 10,
    };

    httpGetSpy.mockReturnValue(of(stats));

    let emitted: Stats | null = null;
    service.getStats().subscribe((resp) => (emitted = resp));

    expect(httpGetSpy).toHaveBeenCalledWith(
      'http://localhost:8080/api/stats/dashboard'
    );
    expect(emitted).toBe(stats);
  });
});


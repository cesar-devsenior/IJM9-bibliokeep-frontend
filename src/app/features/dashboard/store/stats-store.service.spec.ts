import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { StatsStoreService } from './stats-store.service';
import { StatsService } from '../../../core/services/stats.service';
import type { Stats } from '../../../core/models/stats.model';

describe('StatsStoreService', () => {
  let service: StatsStoreService;
  let getStatsSpy: ReturnType<typeof vi.fn>;

  const sampleStats: Stats = {
    totalBooks: 10,
    reading: 2,
    activeLoans: 1,
    returnedLoansThisYear: 3,
    annualGoal: 20,
    progressPercentage: 50,
  };

  beforeEach(() => {
    getStatsSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        StatsStoreService,
        { provide: StatsService, useValue: { getStats: getStatsSpy } },
      ],
    });

    service = TestBed.inject(StatsStoreService);
  });

  it('should be created with initial state', () => {
    expect(service).toBeTruthy();
    expect(service.stats()).toEqual({
      totalBooks: 0,
      reading: 0,
      activeLoans: 0,
      returnedLoansThisYear: 0,
      annualGoal: 0,
      progressPercentage: 0,
    });
    expect(service.isLoading()).toBe(false);
  });

  it('should load stats successfully', () => {
    getStatsSpy.mockReturnValue(of(sampleStats));

    service.loadStats();

    expect(service.isLoading()).toBe(false);
    expect(service.stats()).toEqual(sampleStats);
    expect(getStatsSpy).toHaveBeenCalled();
  });

  it('should handle error when loading stats and reset to empty stats', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getStatsSpy.mockReturnValue(throwError(() => new Error('fail')));

    service.loadStats();

    expect(service.isLoading()).toBe(false);
    expect(service.stats()).toEqual({
      totalBooks: 0,
      reading: 0,
      activeLoans: 0,
      returnedLoansThisYear: 0,
      annualGoal: 0,
      progressPercentage: 0,
    });
    expect(consoleErrorSpy).toHaveBeenCalled();
  });
});


import { TestBed } from '@angular/core/testing';
import { DashboardPage } from './dashboard.page';
import { StatsStoreService } from './store/stats-store.service';

describe('DashboardPage', () => {
  let loadStatsSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    loadStatsSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [DashboardPage],
      providers: [
        {
          provide: StatsStoreService,
          useValue: {
            loadStats: loadStatsSpy,
            stats: () => ({
              totalBooks: 0,
              reading: 0,
              activeLoans: 0,
              returnedLoansThisYear: 0,
              annualGoal: 0,
              progressPercentage: 0,
            }),
            isLoading: () => false,
          },
        },
      ],
    }).compileComponents();
  });

  it('should create the dashboard page', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should call loadStats on init', () => {
    const fixture = TestBed.createComponent(DashboardPage);
    fixture.detectChanges();

    expect(loadStatsSpy).toHaveBeenCalled();
  });
});


import { TestBed } from '@angular/core/testing';
import { LoansPage } from './loans.page';

describe('LoansPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LoansPage],
    }).compileComponents();
  });

  it('should create the loans page', () => {
    const fixture = TestBed.createComponent(LoansPage);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });
});


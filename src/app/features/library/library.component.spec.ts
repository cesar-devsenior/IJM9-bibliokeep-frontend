import { TestBed } from '@angular/core/testing';
import { computed, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { LibraryComponent } from './library.component';
import { BookStoreService, type BookStatusFilter } from './store/book-store.service';
import { BookStatus } from '../../core/models/book.model';

describe('LibraryComponent', () => {
  let loadCollectionSpy: ReturnType<typeof vi.fn>;
  let searchSpy: ReturnType<typeof vi.fn>;
  let setStatusFilterSpy: ReturnType<typeof vi.fn>;
  let updateStatusOptimisticSpy: ReturnType<typeof vi.fn>;
  let updateRatingOptimisticSpy: ReturnType<typeof vi.fn>;

  beforeEach(async () => {
    loadCollectionSpy = vi.fn();
    searchSpy = vi.fn();
    setStatusFilterSpy = vi.fn();
    updateStatusOptimisticSpy = vi.fn();
    updateRatingOptimisticSpy = vi.fn();

    await TestBed.configureTestingModule({
      imports: [LibraryComponent],
      providers: [
        {
          provide: BookStoreService,
          useValue: {
            loadCollection: loadCollectionSpy,
            search: searchSpy,
            setStatusFilter: setStatusFilterSpy,
            updateStatusOptimistic: updateStatusOptimisticSpy,
            updateRatingOptimistic: updateRatingOptimisticSpy,
            // Signals en lugar de funciones
            books: signal([]),
            isLoading: signal(false),
            statusFilter: signal('ALL' as BookStatusFilter),
            filteredBooks: computed(() => []),
          },
        },
        { provide: ActivatedRoute, useValue: {} }
      ],
    }).compileComponents();
  });

  it('should create the library component', () => {
    const fixture = TestBed.createComponent(LibraryComponent);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });

  it('should load collection on init (effect)', () => {
    const fixture = TestBed.createComponent(LibraryComponent);
    fixture.detectChanges();

    expect(loadCollectionSpy).toHaveBeenCalled();
  });

  it('should update query and perform search on submit', () => {
    const fixture = TestBed.createComponent(LibraryComponent);
    const component = fixture.componentInstance as any;

    component.onQueryInput('angular');
    component.onSearchSubmit();

    expect(searchSpy).toHaveBeenCalledWith('angular');
  });

  it('should change status filter', () => {
    const fixture = TestBed.createComponent(LibraryComponent);
    const component = fixture.componentInstance as any;

    component.onFilterChange('DESEADO' as BookStatusFilter);

    expect(setStatusFilterSpy).toHaveBeenCalledWith('DESEADO');
  });

  it('should delegate status and rating changes to store', () => {
    const fixture = TestBed.createComponent(LibraryComponent);
    const component = fixture.componentInstance as any;

    component.onStatusChange(1, 'LEIDO' as BookStatus);
    component.onRatingChange(1, 5);

    expect(updateStatusOptimisticSpy).toHaveBeenCalledWith(1, 'LEIDO');
    expect(updateRatingOptimisticSpy).toHaveBeenCalledWith(1, 5);
  });
});


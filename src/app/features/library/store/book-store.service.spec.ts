import { TestBed } from '@angular/core/testing';
import { of, throwError } from 'rxjs';

import { BookStoreService } from './book-store.service';
import { BookService } from '../../../core/services/book.service';
import type { Book } from '../../../core/models/book.model';

describe('BookStoreService', () => {
  let service: BookStoreService;
  let getAllBooksSpy: ReturnType<typeof vi.fn>;
  let searchBooksSpy: ReturnType<typeof vi.fn>;
  let updateBookSpy: ReturnType<typeof vi.fn>;

  const sampleBooks: Book[] = [
    {
      id: 1,
      title: 'Clean Code',
      authors: ['Robert C. Martin'],
      isbn: '1234567890',
      description: 'A classic book about writing clean code.',
      thumbnail: 'http://example.com/clean.jpg',
      status: 'DESEADO',
      rating: 3,
      isLent: false,
      ownerId: 'user-1',
    },
    {
      id: 2,
      title: 'Refactoring',
      authors: ['Martin Fowler'],
      isbn: '0987654321',
      description: 'Refactoring techniques.',
      thumbnail: 'http://example.com/refactoring.jpg',
      status: 'LEIDO',
      rating: 5,
      isLent: false,
      ownerId: 'user-1',
    },
  ];

  beforeEach(() => {
    getAllBooksSpy = vi.fn();
    searchBooksSpy = vi.fn();
    updateBookSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        BookStoreService,
        {
          provide: BookService,
          useValue: {
            getAllBooks: getAllBooksSpy,
            searchBooks: searchBooksSpy,
            updateBook: updateBookSpy,
          },
        },
      ],
    });

    service = TestBed.inject(BookStoreService);
  });

  it('should be created with initial state', () => {
    expect(service).toBeTruthy();
    expect(service.books()).toEqual([]);
    expect(service.isLoading()).toBe(false);
    expect(service.statusFilter()).toBe('ALL');
  });

  it('should filter books by status', () => {
    service.books.set(sampleBooks);

    // filtro ALL devuelve todos
    service.statusFilter.set('ALL');
    expect(service.filteredBooks()).toHaveLength(2);

    // filtro específico
    service.statusFilter.set('LEIDO');
    expect(service.filteredBooks()).toHaveLength(1);
    expect(service.filteredBooks()[0].status).toBe('LEIDO');
  });

  it('should set status filter through setStatusFilter', () => {
    service.setStatusFilter('DESEADO');
    expect(service.statusFilter()).toBe('DESEADO');
  });

  it('should load collection successfully', () => {
    getAllBooksSpy.mockReturnValue(of(sampleBooks));

    service.loadCollection();

    expect(service.isLoading()).toBe(false);
    expect(service.books()).toEqual(sampleBooks);
    expect(getAllBooksSpy).toHaveBeenCalled();
  });

  it('should handle error when loading collection', () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {});
    getAllBooksSpy.mockReturnValue(throwError(() => new Error('fail')));

    service.loadCollection();

    expect(service.isLoading()).toBe(false);
    expect(service.books()).toEqual([]);
    expect(consoleErrorSpy).toHaveBeenCalled();
  });

  it('should search books when query is not empty', () => {
    searchBooksSpy.mockReturnValue(of(sampleBooks));

    service.search('  clean ');

    expect(service.isLoading()).toBe(false);
    expect(service.books()).toEqual(sampleBooks);
    expect(searchBooksSpy).toHaveBeenCalledWith('clean');
  });

  it('should not search when query is empty after trim', () => {
    service.search('   ');

    expect(searchBooksSpy).not.toHaveBeenCalled();
  });

  it('should update status and rollback on error', () => {
    const prevBooks: Book[] = [...sampleBooks];
    service.books.set(prevBooks);

    updateBookSpy.mockReturnValue(throwError(() => new Error('fail')));

    service.updateStatusOptimistic(1, 'LEIDO');

    // tras error, rollback al estado previo
    expect(service.books()).toEqual(prevBooks);
  });

  it('should update rating (bounded) and rollback on error', () => {
    const prevBooks: Book[] = [...sampleBooks];
    service.books.set(prevBooks);

    updateBookSpy.mockReturnValue(throwError(() => new Error('fail')));

    service.updateRatingOptimistic(1, 10);

    // tras error, rollback al estado previo
    expect(service.books()).toEqual(prevBooks);
    // y se llamó a updateBook con rating acotado
    const calledDto = (updateBookSpy as any).mock.calls[0][1] as Book;
    expect(calledDto.rating).toBe(5);
  });
});


import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';
import { HttpClient } from '@angular/common/http';

import { BookService, type BookRequestDTO } from './book.service';
import type { Book } from '../models/book.model';
import { StorageService } from './storage.service';

describe('BookService', () => {
  let httpGetSpy: ReturnType<typeof vi.fn>;
  let httpPutSpy: ReturnType<typeof vi.fn>;

  beforeEach(() => {
    httpGetSpy = vi.fn();
    httpPutSpy = vi.fn();

    TestBed.configureTestingModule({
      providers: [
        BookService,
        {
          provide: HttpClient,
          useValue: {
            get: httpGetSpy,
            put: httpPutSpy,
          },
        },
        // se inyecta en el servicio aunque en los métodos actuales no se use
        { provide: StorageService, useValue: {} },
      ],
    });
  });

  it('should be created', () => {
    const service = TestBed.inject(BookService);
    expect(service).toBeTruthy();
  });

  it('should request all books', () => {
    const service = TestBed.inject(BookService);
    const books: Book[] = [];
    httpGetSpy.mockReturnValue(of(books));

    let emitted: Book[] | null = null;
    service.getAllBooks().subscribe((resp) => (emitted = resp));

    expect(httpGetSpy).toHaveBeenCalledWith('http://localhost:8080/api/books');
    expect(emitted).toBe(books);
  });

  it('should search books by query', () => {
    const service = TestBed.inject(BookService);
    const books: Book[] = [];
    httpGetSpy.mockReturnValue(of(books));

    let emitted: Book[] | null = null;
    service.searchBooks('angular').subscribe((resp) => (emitted = resp));

    expect(httpGetSpy).toHaveBeenCalledWith(
      'http://localhost:8080/api/books/search',
      { params: { q: 'angular' } }
    );
    expect(emitted).toBe(books);
  });

  it('should update a book', () => {
    const service = TestBed.inject(BookService);
    const dto: BookRequestDTO = {
      title: 'Clean Code',
      authors: ['Robert C. Martin'],
      isbn: '1234567890',
      description: 'A classic book about writing clean code.',
      thumbnail: 'http://example.com/cover.jpg',
      status: 'LEIDO',
      rating: 5,
      isLent: false,
      ownerId: 'user-1',
    };
    const updated: Book = { id: 1, ...dto };
    httpPutSpy.mockReturnValue(of(updated));

    let emitted: Book | null = null;
    service.updateBook(1, dto).subscribe((resp) => (emitted = resp));

    expect(httpPutSpy).toHaveBeenCalledWith(
      'http://localhost:8080/api/books/1',
      dto
    );
    expect(emitted).toBe(updated);
  });
});


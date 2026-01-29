import { computed, Injectable, signal } from '@angular/core';
import { catchError, finalize, of, tap } from 'rxjs';

import { BookService } from '../../../core/services/book.service';
import { Book, BookStatus } from '../../../core/models/book.model';

export type BookStatusFilter = BookStatus | 'ALL';

@Injectable({ providedIn: 'root' })
export class BookStoreService {
  /**
   * Sin seguridad aún, el backend actual exige el header "user-id".
   * Ajusta este valor (o muévelo a un UserStore/AuthStore) cuando tengas auth.
   */
  private readonly userId = signal<string>('9f251e9c-4198-45c6-be8c-abe9945273d8');

  readonly books = signal<Book[]>([]);
  readonly isLoading = signal(false);
  readonly statusFilter = signal<BookStatusFilter>('ALL');

  readonly filteredBooks = computed(() => {
    const filter = this.statusFilter();
    const list = this.books();
    if (filter === 'ALL') return list;
    return list.filter((b) => b.status === filter);
  });

  constructor(private readonly bookApi: BookService) {}

  setStatusFilter(status: BookStatusFilter): void {
    this.statusFilter.set(status);
  }

  loadCollection(): void {
    this.isLoading.set(true);
    this.bookApi
      .getAllBooks(this.userId())
      // .pipe(
      //   tap((books) => this.books.set(books)),
      //   catchError(() => of([] as Book[])),
      //   finalize(() => this.isLoading.set(false))
      // )
      .subscribe({
        next: (books) => {
          this.books.set(books);
          this.isLoading.set(false);
        },
        error: (errors) => {
          this.books.set([]);
          console.error('Ocurrió un problema al listar los libros:', errors);
          this.isLoading.set(false);
        }
      });
  }

  search(query: string): void {
    const q = query.trim();
    if (!q) return;
    this.isLoading.set(true);
    this.bookApi
      .searchBooks(q, this.userId())
      .pipe(
        tap((books) => this.books.set(books)),
        catchError(() => of([] as Book[])),
        finalize(() => this.isLoading.set(false))
      )
      .subscribe();
  }

  /** Optimistic UI: cambia status localmente y luego persiste */
  updateStatusOptimistic(bookId: number, status: BookStatus): void {
    const prev = this.books();
    const idx = prev.findIndex((b) => b.id === bookId);
    if (idx < 0) return;

    const optimistic: Book = { ...prev[idx], status };
    this.books.set([...prev.slice(0, idx), optimistic, ...prev.slice(idx + 1)]);

    this.bookApi
      .updateBook(bookId, this.toRequestDto(optimistic), this.userId())
      .pipe(
        catchError((err) => {
          // rollback
          this.books.set(prev);
          return of(null);
        })
      )
      .subscribe();
  }

  /** Optimistic UI: cambia rating localmente y luego persiste */
  updateRatingOptimistic(bookId: number, rating: number): void {
    const bounded = Math.max(1, Math.min(5, rating));

    const prev = this.books();
    const idx = prev.findIndex((b) => b.id === bookId);
    if (idx < 0) return;

    const optimistic: Book = { ...prev[idx], rating: bounded };
    this.books.set([...prev.slice(0, idx), optimistic, ...prev.slice(idx + 1)]);

    this.bookApi
      .updateBook(bookId, this.toRequestDto(optimistic), this.userId())
      .pipe(
        catchError(() => {
          // rollback
          this.books.set(prev);
          return of(null);
        })
      )
      .subscribe();
  }

  private toRequestDto(book: Book): Omit<Book, 'id'> {
    // Coincide con BookRequestDTO del backend (misma forma sin id)
    // ownerId es requerido por el record
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { id, ...dto } = book;
    return dto;
  }
}


import { Component, computed, effect, inject, signal } from '@angular/core';

import { BookStatus } from '../../core/models/book.model';
import { BookStoreService, type BookStatusFilter } from './store/book-store.service';
import { BookCardComponent } from './components/book-card/book-card.component';

@Component({
  selector: 'app-library',
  standalone: true,
  imports: [BookCardComponent],
  templateUrl: './library.component.html'
})
export class LibraryComponent {
  private readonly store = inject(BookStoreService);

  protected readonly query = signal('');

  protected readonly isLoading = this.store.isLoading;
  protected readonly statusFilter = this.store.statusFilter;
  protected readonly books = this.store.books;
  protected readonly filteredBooks = this.store.filteredBooks;

  protected readonly totalCount = computed(() => this.books().length);
  protected readonly filteredCount = computed(() => this.filteredBooks().length);

  protected readonly filters: { value: BookStatusFilter; label: string }[] = [
    { value: 'ALL', label: 'Todos' },
    { value: 'DESEADO', label: 'Deseado' },
    { value: 'COMPRADO', label: 'Comprado' },
    { value: 'LEYENDO', label: 'Leyendo' },
    { value: 'LEIDO', label: 'Leído' },
    { value: 'ABANDONADO', label: 'Abandonado' }
  ];

  constructor() {
    effect(() => this.store.loadCollection());
  }

  protected onSearchSubmit(): void {
    this.store.search(this.query());
  }

  protected onQueryInput(raw: string): void {
    this.query.set(raw);
  }

  protected onFilterChange(value: BookStatusFilter): void {
    this.store.setStatusFilter(value);
  }

  protected onStatusChange(bookId: number, status: BookStatus): void {
    this.store.updateStatusOptimistic(bookId, status);
  }

  protected onRatingChange(bookId: number, rating: number): void {
    this.store.updateRatingOptimistic(bookId, rating);
  }
}


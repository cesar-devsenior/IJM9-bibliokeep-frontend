import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgClass } from '@angular/common';

import { Book, BookStatus } from '../../../../core/models/book.model';

@Component({
  selector: 'app-book-card',
  standalone: true,
  imports: [NgClass],
  templateUrl: './book-card.component.html'
})
export class BookCardComponent {
  @Input({ required: true }) book!: Book;

  @Output() statusChange = new EventEmitter<BookStatus>();
  @Output() ratingChange = new EventEmitter<number>();

  protected readonly statuses: { value: BookStatus; label: string }[] = [
    { value: 'DESEADO', label: 'Deseado' },
    { value: 'COMPRADO', label: 'Comprado' },
    { value: 'LEYENDO', label: 'Leyendo' },
    { value: 'LEIDO', label: 'Leído' },
    { value: 'ABANDONADO', label: 'Abandonado' }
  ];

  protected setStatus(value: BookStatus): void {
    this.statusChange.emit(value);
  }

  protected setRating(value: number): void {
    this.ratingChange.emit(value);
  }

  protected onStatusSelect(raw: string): void {
    this.statusChange.emit(raw as BookStatus);
  }

  protected trackByValue = (_: number, item: { value: BookStatus; label: string }) => item.value;
}


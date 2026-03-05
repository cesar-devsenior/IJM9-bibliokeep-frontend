import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs';

import { BookStatus } from '../../core/models/book.model';
import { BookService, type BookRequestDTO } from '../../core/services/book.service';

@Component({
  selector: 'app-book-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './book-create.page.html'
})
export class BookCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly bookService = inject(BookService);
  private readonly router = inject(Router);

  protected readonly isSubmitting = signal(false);

  protected readonly form = this.fb.group({
    isbn: [
      '',
      [
        Validators.required,
        Validators.pattern(/^\d{10}(\d{3})?$/)
      ]
    ],
    title: [
      '',
      [
        Validators.required,
        Validators.maxLength(200)
      ]
    ],
    authors: [
      '',
      [
        Validators.required,
        Validators.maxLength(500)
      ]
    ],
    description: [
      '',
      [
        Validators.maxLength(1000)
      ]
    ],
    thumbnail: [
      '',
      [
        Validators.maxLength(1000),
        Validators.pattern(/^(https?:\/\/.+)?$/)
      ]
    ],
    status: [
      'DESEADO' as BookStatus,
      [
        Validators.required
      ]
    ],
    rating: [
      null as number | null,
      [
        Validators.min(1),
        Validators.max(5)
      ]
    ],
    isLent: [
      false
    ]
  });

  protected readonly statuses: { value: BookStatus; label: string }[] = [
    { value: 'DESEADO', label: 'Deseado' },
    { value: 'COMPRADO', label: 'Comprado' },
    { value: 'LEYENDO', label: 'Leyendo' },
    { value: 'LEIDO', label: 'Leído' },
    { value: 'ABANDONADO', label: 'Abandonado' }
  ];

  protected get f() {
    return this.form.controls;
  }

  protected onSubmit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    const authorsArray =
      raw.authors
        ?.split(',')
        .map((a) => a.trim())
        .filter((a) => !!a) ?? [];

    const dto: BookRequestDTO = {
      // ownerId se resuelve en el backend a partir del token
      // y no es necesario enviarlo desde el frontend.
      isbn: raw.isbn ?? '',
      title: raw.title ?? '',
      authors: authorsArray,
      description: raw.description ?? '',
      thumbnail: raw.thumbnail ?? '',
      status: (raw.status ?? 'DESEADO') as BookStatus,
      rating: raw.rating ?? null,
      isLent: raw.isLent ?? false
    } as BookRequestDTO;

    this.isSubmitting.set(true);

    this.bookService
      .createBook(dto)
      .pipe(
        finalize(() => this.isSubmitting.set(false))
      )
      .subscribe({
        next: () => {
          this.router.navigateByUrl('/library');
        },
        error: (error) => {
          console.error('Error al crear el libro', error);
        }
      });
  }

  protected onCancel(): void {
    this.router.navigateByUrl('/library');
  }
}


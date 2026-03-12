import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  FormBuilder,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { finalize } from 'rxjs';

import { BookStatus } from '../../../../core/models/book.model';
import { BookService, type BookRequestDTO } from '../../../../core/services/book.service';
import { FileService } from '../../../../core/services/file.service';

@Component({
  selector: 'app-book-create-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './book-create.page.html'
})
export class BookCreatePage {
  private readonly fb = inject(FormBuilder);
  private readonly bookService = inject(BookService);
  private readonly fileService = inject(FileService);
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

  protected selectedFile = signal<File | null>(null);

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

  protected async onSubmit() {
    if (this.form.invalid || !this.selectedFile) {
      this.form.markAllAsTouched();
      return;
    }

    const raw = this.form.value;

    // 1. Enviar a guardar la imagen
    const blob = await this.fileService.compressImage(this.selectedFile()!, 400);

    this.fileService.upload(blob).subscribe({
      next: (data) => {
        // 2. Una vez guardada la imagen, cargo la url en el thumbnail del libro

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
          thumbnail: data.url,
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
      },
      error: (error) => {
        console.error('Error al subir el archivo', error);
       }
    });


  }

  protected onCancel(): void {
    this.router.navigateByUrl('/library');
  }

  protected onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile.set(input.files[0]);
    }
  }
}


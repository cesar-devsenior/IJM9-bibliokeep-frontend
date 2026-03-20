import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from '../models/book.model';
import { StorageService } from './storage.service';
import { environment } from '../../../environments/environment';

export type BookRequestDTO = Omit<Book, 'id'>;

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly baseUrl = `${environment.apiUrl}/api/books`;

  constructor(
    private readonly http: HttpClient, 
    private readonly storage: StorageService) {}

  getAllBooks(): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl);
  }

  searchBooks(query: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/search`, {
      params: { q: query }
    });
  }

  createBook(dto: BookRequestDTO): Observable<Book> {
    return this.http.post<Book>(this.baseUrl, dto);
  }

  updateBook(id: number, dto: BookRequestDTO): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, dto);
  }

}


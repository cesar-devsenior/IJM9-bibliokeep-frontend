import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { Book } from '../models/book.model';

export type BookRequestDTO = Omit<Book, 'id'>;

@Injectable({ providedIn: 'root' })
export class BookService {
  private readonly baseUrl = 'http://localhost:8080/api/books';

  constructor(private readonly http: HttpClient) {}

  getAllBooks(userId?: string): Observable<Book[]> {
    return this.http.get<Book[]>(this.baseUrl, { headers: this.buildHeaders(userId) });
  }

  searchBooks(query: string, userId?: string): Observable<Book[]> {
    return this.http.get<Book[]>(`${this.baseUrl}/search`, {
      params: { q: query },
      headers: this.buildHeaders(userId)
    });
  }

  updateBook(id: number, dto: BookRequestDTO, userId?: string): Observable<Book> {
    return this.http.put<Book>(`${this.baseUrl}/${id}`, dto, { headers: this.buildHeaders(userId) });
  }

  private buildHeaders(userId?: string): HttpHeaders | undefined {
    // Backend actual requiere header "user-id" (sin seguridad/JWT aún).
    if (!userId) return undefined;
    return new HttpHeaders({ 'user-id': userId });
  }
}


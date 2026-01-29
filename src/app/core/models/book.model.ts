export type BookStatus =
  | 'DESEADO'
  | 'COMPRADO'
  | 'LEYENDO'
  | 'LEIDO'
  | 'ABANDONADO';

export interface Book {
  id: number; // Long (Auto-increment)
  ownerId: string; // UUID
  isbn: string; // 10 o 13 dígitos
  title: string;
  authors: string[]; // List<String>
  description: string;
  thumbnail: string; // URL
  status: BookStatus; // Enum
  rating: number; // Integer (1-5)
  isLent: boolean; // Default: false
}


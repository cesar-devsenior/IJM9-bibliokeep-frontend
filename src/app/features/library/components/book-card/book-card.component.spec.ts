import { TestBed } from '@angular/core/testing';
import { BookCardComponent } from './book-card.component';
import { Book, BookStatus } from '../../../../core/models/book.model';

describe('BookCardComponent', () => {
  const sampleBook: Book = {
    id: 1,
    title: 'Clean Code',
    authors: ['Robert C. Martin'],
    isbn: '1234567890',
    description: 'A classic book about writing clean code.',
    thumbnail: 'http://example.com/cover.jpg',
    status: 'DESEADO',
    rating: 3,
    isLent: false,
    ownerId: 'user-1',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BookCardComponent],
    }).compileComponents();
  });

  it('should create the book card component', () => {
    const fixture = TestBed.createComponent(BookCardComponent);
    const component = fixture.componentInstance;

    fixture.componentRef.setInput('book', sampleBook);
    fixture.detectChanges();

    expect(component).toBeTruthy();
  });

  it('should emit statusChange and ratingChange from methods', () => {
    const fixture = TestBed.createComponent(BookCardComponent);
    const component = fixture.componentInstance as any;

    fixture.componentRef.setInput('book', sampleBook);
    fixture.detectChanges();

    const statusSpy = vi.fn();
    const ratingSpy = vi.fn();

    component.statusChange.subscribe(statusSpy);
    component.ratingChange.subscribe(ratingSpy);

    component.setStatus('LEIDO' as BookStatus);
    component.setRating(5);

    expect(statusSpy).toHaveBeenCalledWith('LEIDO');
    expect(ratingSpy).toHaveBeenCalledWith(5);
  });

  it('should emit statusChange when selecting from template handler', () => {
    const fixture = TestBed.createComponent(BookCardComponent);
    const component = fixture.componentInstance as any;

    fixture.componentRef.setInput('book', sampleBook);
    fixture.detectChanges();

    const statusSpy = vi.fn();
    component.statusChange.subscribe(statusSpy);

    component.onStatusSelect('COMPRADO');

    expect(statusSpy).toHaveBeenCalledWith('COMPRADO');
  });
});


import { TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { LibraryPage } from './library.page';
import { LibraryComponent } from './library.component';

describe('LibraryPage', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LibraryPage, LibraryComponent],
      providers: [
        { provide: ActivatedRoute, useValue: {} }
      ]
    }).compileComponents();
  });

  it('should create the library page', () => {
    const fixture = TestBed.createComponent(LibraryPage);
    const component = fixture.componentInstance;

    expect(component).toBeTruthy();
  });
});


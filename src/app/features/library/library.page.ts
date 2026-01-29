import { Component } from '@angular/core';
import { LibraryComponent } from './library.component';

@Component({
  selector: 'app-library-page',
  standalone: true,
  imports: [LibraryComponent],
  template: `<app-library />`
})
export class LibraryPage {}


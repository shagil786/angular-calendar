import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { map, timer } from 'rxjs';

@Component({
  selector: 'app-current-time',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  template: `
    {{ time$ | async }}
  `,
  styles: ``,
})
export class CurrentTimeComponent {
  readonly time$ = timer(0, 500).pipe(
    map(() => {
      const now = new Date();
      const hours = now.getHours();
      const minutes = now.getMinutes();
      const separator = now.getMilliseconds() < 500 ? ':' : ' ';
      return `${ hours }${ separator }${ minutes.toString().padStart(2, '0') }`;
    }),
  );
}

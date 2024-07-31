import { FormatTimePipe } from '@/shared/format-time.pipe';
import { Component, input } from '@angular/core';

@Component({
  selector: 'app-hour',
  standalone: true,
  imports: [
    FormatTimePipe,
  ],
  template: `
    {{ hour() * 60 | formatTime }}
  `,
  styles: `
    :host {
      display: block;
      box-sizing: border-box;
      border: 1px dotted silver;
      border-bottom: none;
      font-size: 0.6em;
      color: silver;
      padding: 0 3px;
    }
  `
})
export class HourComponent {
  readonly hour = input.required<number>();
}

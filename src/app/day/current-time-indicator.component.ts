import { Component, HostBinding, input } from '@angular/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';
import { distinctUntilChanged, map, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-current-time-indicator',
  standalone: true,
  imports: [],
  template: ``,
  styles: `
  :host {
    display: block;
    position: relative;
    margin-bottom: 20px; /* Added margin bottom for spacing */
    background-color: #fff; /* Added background color */
    border: 1px solid #ccc; /* Added border */
    border-radius: 8px; /* Rounded corners */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
  }

  /* Style for the top border */
  :host:before {
    content: '';
    display: block;
    width: 100%;
    height: 0;
    border-top: 5px solid red; /* Adjusted border color and width */
    position: absolute;
    top: -5px; /* Positioned above the calendar */
    left: 0;
    z-index: 1; /* Ensure it appears above other elements */
  }
  `,
})
export class CurrentTimeIndicatorComponent {
  readonly pixelsPerMinute = input.required<number>();

  readonly #top$ = toObservable(this.pixelsPerMinute).pipe(
    switchMap(pixelsPerMinute => timer(0, 1000).pipe(
      map(() => {
        const now = new Date();
        return (now.getHours() * 60 + now.getMinutes()) * pixelsPerMinute;
      }),
    )),
    distinctUntilChanged(),
  );

  readonly #topSignal = toSignal(this.#top$);

  @HostBinding('visibility')
  get visibility(): string {
    return this.pixelsPerMinute() ? 'visible' : 'hidden';
  }

  @HostBinding('style.top.px')
  get top(): number | undefined {
    return this.#topSignal();
  }
}

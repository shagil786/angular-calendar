import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest, map, timer } from 'rxjs';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-totals',
  standalone: true,
  imports: [
    AsyncPipe,
  ],
  template: `
    <b>Appointments:</b><br/>
    Today: {{ today$ | async }}<br/>
    This week: {{ thisWeek$ | async }}<br/>
    This month: {{ thisMonth$ | async }}
  `,
  styles: `
    :host {
      display: block;
      margin: 10px;
      padding: 10px;
      border: 1px solid #E0E0E0;
      border-radius: 4px;
      background-color: #F8F8F8;
    }
  `,
})
export class TotalsComponent {
  readonly #data = inject(DataService);

  readonly #now$ = timer(0, 1000).pipe(
    map(() => new Date()),
  );

  readonly #todayStart$ = this.#now$.pipe(
    map(now => new Date(now.getFullYear(), now.getMonth(), now.getDate())),
  );

  readonly #todayEnd$ = this.#now$.pipe(
    map(now => new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1)),
  );

  readonly today$ = combineLatest([
    this.#todayStart$,
    this.#todayEnd$,
    this.#data.getAppointmentsStream(),
  ]).pipe(
    map(([ start, end, appointments ]) => appointments.filter(appointment => appointment.start >= start && appointment.start < end).length),
  );

  readonly #thisWeekStart$ = this.#now$.pipe(
    map(now => {
      const day = now.getDay();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
    }),
  );

  readonly #thisWeekEnd$ = this.#now$.pipe(
    map(now => {
      const day = now.getDay();
      return new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7 - day);
    }),
  );

  readonly thisWeek$ = combineLatest([
    this.#thisWeekStart$,
    this.#thisWeekEnd$,
    this.#data.getAppointmentsStream(),
  ]).pipe(
    map(([ start, end, appointments ]) => appointments.filter(appointment => appointment.start >= start && appointment.start < end).length),
  );

  readonly #thisMonthStart$ = this.#now$.pipe(
    map(now => new Date(now.getFullYear(), now.getMonth(), 1)),
  );

  readonly #thisMonthEnd$ = this.#now$.pipe(
    map(now => new Date(now.getFullYear(), now.getMonth() + 1, 0)),
  );

  readonly thisMonth$ = combineLatest([
    this.#thisMonthStart$,
    this.#thisMonthEnd$,
    this.#data.getAppointmentsStream(),
  ]).pipe(
    map(([ start, end, appointments ]) => appointments.filter(appointment => appointment.start >= start && appointment.start <= end).length),
  );
}

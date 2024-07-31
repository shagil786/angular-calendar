import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { combineLatest, map, timer } from 'rxjs';
import { DataService } from '../../data.service';
import { FormatTimePipe } from '../format-time.pipe';

@Component({
  selector: 'app-next-appointment',
  standalone: true,
  imports: [
    AsyncPipe,
    FormatTimePipe,
  ],
  template: `
    <b>Next appointment:</b><br/>
    @if (nextAppointment$ | async; as nextAppointment) {
      {{ nextAppointment.start | formatTime }} {{ nextAppointment.title }}
    } @else {
      <i>n/a</i>
    }
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
export class NextAppointmentComponent {
  readonly #data = inject(DataService);

  readonly #now$ = timer(0, 1000).pipe(
    map(() => new Date()),
  );

  readonly nextAppointment$ = combineLatest([ this.#data.getAppointmentsStream(), this.#now$ ]).pipe(
    map(([ appointments, now ]) => {
      const orderedAppointments = [ ...appointments ].sort((a, b) => a.start.getTime() - b.start.getTime());
      return orderedAppointments.find(appointment => appointment.start > now);
    }),
  );
}

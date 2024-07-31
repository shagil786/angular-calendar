import { ConfirmService } from '@/shared/confirm';
import { GlobalToolbarWidgetDirective } from '@/shared/global-toolbar';
import { NavigationService } from '@/shared/navigation.service';
import { CdkDrag } from '@angular/cdk/drag-drop';
import { AsyncPipe, NgForOf } from '@angular/common';
import { Component, HostBinding, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { MatIconButton } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIcon } from '@angular/material/icon';
import { MatTooltip } from '@angular/material/tooltip';
import { ActivatedRoute } from '@angular/router';
import { combineLatest, map, Observable, take } from 'rxjs';
import { AppointmentFormComponent } from '../appointment-form/appointment-form.component';
import { Appointment, DataService } from '../data.service';
import { AppointmentComponent } from './appointment.component';
import { CurrentTimeIndicatorComponent } from './current-time-indicator.component';
import { HourComponent } from './hour.component';

function isSameDate(date1: Date) {
  return (date2: Date) => {
    return date1.getFullYear() === date2.getFullYear() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getDate() === date2.getDate();
  }
}

function appointmentsIntersect(a: Readonly<Appointment>, b: Readonly<Appointment>): boolean {
  return a.start.getTime() < b.start.getTime() + b.length * 60 * 1000 &&
    a.start.getTime() + a.length * 60 * 1000 > b.start.getTime();
}

@Component({
  selector: 'app-day',
  standalone: true,
  imports: [
    AsyncPipe,
    HourComponent,
    AppointmentComponent,
    CdkDrag,
    CurrentTimeIndicatorComponent,
    GlobalToolbarWidgetDirective,
    MatIcon,
    MatIconButton,
    MatTooltip,
    NgForOf,
  ],
  templateUrl: './day.component.html',
  styleUrl: './day.component.scss'
})
export class DayComponent {
  readonly #data = inject(DataService);
  readonly #matDialog = inject(MatDialog);
  readonly #confirmService = inject(ConfirmService);
  readonly #route = inject(ActivatedRoute);
  readonly #dateParam$ = this.#route.params.pipe(map(params => params['date']));
  readonly #date$ = this.#dateParam$.pipe(map(date => {
    const matches = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (matches) {
      return new Date(+matches[1], +matches[2] - 1, +matches[3]);
    } else {
      return new Date();
    }
  }));
  readonly #navigation = inject(NavigationService);

  readonly hours = Array.from({ length: 24 }, (_, i) => i);
  readonly pixelsPerMinute = 1;

  @HostBinding('style.height.px')
  readonly height = this.hours.length * 60 * this.pixelsPerMinute;

  readonly appointments$ = combineLatest([ this.#data.getAppointmentsStream(), this.#date$ ]).pipe(
    map(([ appointments, date ]) => {
      const isToday = isSameDate(date);
      return appointments
        .filter(appointment => isToday(appointment.start))
        .sort((a, b) => a.start.getTime() - b.start.getTime());
    }),
  );

  readonly trackByValue = <T>(index: number, value: T): T => value;
  readonly trackById = <T extends { id: PropertyKey }>(index: number, value: T) => value.id;

  readonly #offsets$: Observable<Map<Appointment, {
    width: string,
    left: string
  }>> = this.appointments$.pipe(
    map(appointments => {
      const clusters = appointments.reduce((clusters, appointment) => {
        if ((clusters[clusters.length - 1] ?? []).some(previous => appointmentsIntersect(previous, appointment))) {
          clusters[clusters.length - 1].push(appointment);
        } else {
          clusters.push([ appointment ]);
        }
        return clusters;
      }, [] as Readonly<Appointment>[][]);

      return new Map(
        clusters.flatMap(cluster => {
          return cluster.map((appointment, i) => {
              return [
                appointment,
                {
                  width: (100 / cluster.length) + '%',
                  left: (100 / cluster.length * i) + '%',
                },
              ];
            },
          );
        }),
      );
    }),
  );

  readonly offsets = toSignal(this.#offsets$);

  setAppointmentStart(appointment: Readonly<Appointment>, minutes: number): void {
    minutes = Math.floor(minutes / 15) * 15;
    this.#data.updateAppointment({
      ...appointment,
      start: new Date(
        appointment.start.getFullYear(),
        appointment.start.getMonth(),
        appointment.start.getDate(),
        Math.floor(minutes / 60),
        minutes % 60,
      ),
    });
  }

  editAppointment(appointment: Readonly<Appointment>): void {
    AppointmentFormComponent.open(
      this.#matDialog,
      appointment,
    ).subscribe(appointment => {
      if (appointment) {
        this.#data.updateAppointment(appointment);
      }
    });
  }

  deleteAppointment(appointment: Readonly<Appointment>): void {
    this.#confirmService.ask({
      title: 'Warning!',
      message: 'Are you sure you want to delete this appointment?',
      confirmText: 'Delete',
      cancelText: 'Leave it',
    }).subscribe(confirmed => {
      if (confirmed) {
        this.#data.deleteAppointment(appointment.id);
      }
    });
  }

  addAppointment(minute: number = new Date().getHours() * 60 + new Date().getMinutes()): void {
    minute = Math.floor(minute / 15) * 15;
    AppointmentFormComponent.open(
      this.#matDialog,
      {
        id: -1,
        start: new Date(
          new Date().getFullYear(),
          new Date().getMonth(),
          new Date().getDate(),
          Math.floor(minute / 60),
          minute % 60,
        ),
        length: 30,
        title: '',
        description: '',
        color: 'red',
      }
    ).subscribe(appointment => {
      if (appointment) {
        this.#data.addAppointment(appointment);
      }
    });
  }

  previousDay(): void {
    this.#date$.pipe(take(1)).subscribe(date => {
      date.setDate(date.getDate() - 1);
      this.#navigation.goToDate(date);
    });
  }

  nextDay(): void {
    this.#date$.pipe(take(1)).subscribe(date => {
      date.setDate(date.getDate() + 1);
      this.#navigation.goToDate(date);
    });
  }
}

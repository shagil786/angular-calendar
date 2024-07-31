import { Injectable, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

export const appointmentColors = {
  red: '#FFDDDD',
  green: '#DDFFDD',
  blue: '#DDDDFF',
  yellow: '#FFFFDD',
  purple: '#FFDDFF',
  cyan: '#DDFFFF',
  orange: '#FFCC99',
};

export type AppointmentColor = keyof typeof appointmentColors;

export interface Appointment {
  id: number;
  start: Date;
  length: number;
  title: string;
  description: string;
  color: AppointmentColor;
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private readonly appointments = signal<Appointment[]>([]);
  private nextId = 1;

  constructor() {
    this.addAppointment({
      id: -1,
      start: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        8,
        0,
        0,
      ),
      length: 240,
      title: 'Angular Calendar Assessment',
      description: 'This is the first appointment',
      color: 'green',
    });
    this.addAppointment({
      id: -1,
      start: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        13,
        0,
        0,
      ),
      length: 30,
      title: 'Lunch',
      description: 'This is the second appointment',
      color: 'orange',
    });
    this.addAppointment({
      id: -1,
      start: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate() + 1,
        13,
        0,
        0,
      ),
      length: 30,
      title: 'Something dengerous tomorrow',
      description: 'This is the third appointment',
      color: 'cyan',
    });
    this.addAppointment({
      id: -1,
      start: new Date(
        new Date().getFullYear(),
        new Date().getMonth(),
        new Date().getDate(),
        10,
        15,
        0,
      ),
      length: 30,
      title: 'Short break',
      description: 'This is the fifth appointment',
      color: 'cyan',
    });
  }

  getAppointmentsStream(): Observable<ReadonlyArray<Readonly<Appointment>>> {
    return toObservable(this.appointments);
  }

  addAppointment(appointment: Readonly<Appointment>): void {
    if (appointment.id === -1) {
      appointment = {
        ...appointment,
        id: this.nextId++,
      };
    }
    this.appointments.update(appointments => [...appointments, appointment]);
  }

  updateAppointment(appointment: Readonly<Appointment>): void {
    this.appointments.update(appointments => appointments.map(a => a.id === appointment.id ? appointment : a));
  }

  deleteAppointment(appointmentId: Appointment['id']): void {
    this.appointments.update(appointments => appointments.filter(a => a.id !== appointmentId));
  }
}

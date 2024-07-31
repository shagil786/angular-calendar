import { FormatTimePipe } from '@/shared/format-time.pipe';
import { Component, input, output } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { Appointment, appointmentColors } from '../data.service';

@Component({
  selector: 'app-appointment',
  standalone: true,
  imports: [
    MatIconButton,
    MatIcon,
    FormatTimePipe,
  ],
  template: `
    <p [style.background-color]="appointmentColors[data().color]">
      {{ data().start | formatTime }}
      {{ data().title }}
      <button mat-icon-button (click)="delete.emit()">
        <mat-icon>delete</mat-icon>
      </button>
    </p>
  `,
  styles: `
   :host {
    display: block;
    position: relative;
    min-height: 50px; /* Increased min-height for better visibility */
  }

  p {
    position: absolute;
    margin: 0;
    height: 100%;
    padding: 10px; /* Increased padding for better readability */
    left: 0;
    right: 0;
    min-height: 50px; /* Increased min-height for better visibility */
    box-sizing: border-box;
    border: 1px solid rgba(0, 0, 0, 0.1);
    border-radius: 10px; /* Increased border radius for rounded corners */
    background-color: #fff; /* Added background color for better contrast */
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1); /* Added shadow for depth */
  }

  button {
    transform: scale(0.8); /* Adjusted scale for better size */
    position: absolute;
    top: 5px; /* Adjusted top position for better alignment */
    right: 5px; /* Adjusted right position for better alignment */
    background-color: #ff6347; /* Changed button color to a shade of red */
    color: #fff; /* Changed text color to white */
    border: none; /* Removed border for cleaner appearance */
    border-radius: 50%; /* Rounded shape */
    width: 30px; /* Adjusted width for better size */
    height: 30px; /* Adjusted height for better size */
    cursor: pointer; /* Added cursor pointer for better usability */
    font-size: 18px; /* Adjusted font size for better readability */
    line-height: 30px; /* Centered text vertically */
    text-align: center; /* Centered text horizontally */
  }

  `
})
export class AppointmentComponent {
  readonly data = input.required<Appointment>();
  readonly delete = output();
  protected readonly appointmentColors = appointmentColors;
}

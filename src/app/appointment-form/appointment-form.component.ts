import { FormatTimePipe } from '@/shared/format-time.pipe';
import { NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButton } from '@angular/material/button';
import { MatOption, provideNativeDateAdapter } from '@angular/material/core';
import { MatDatepicker, MatDatepickerInput, MatDatepickerToggle } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialog, MatDialogActions, MatDialogClose, MatDialogContent, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { Observable } from 'rxjs';
import { Appointment, appointmentColors } from '../data.service';

export type AppointmentFormDialogData = Readonly<Appointment>;

export type AppointmentFormDialogResult =
  | Appointment
  | null
  ;

@Component({
  selector: 'app-appointment-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInput,
    MatDatepickerToggle,
    MatDatepicker,
    MatDatepickerInput,
    MatSelectModule,
    MatOption,
    FormatTimePipe,
    MatDialogContent,
    MatDialogActions,
    MatButton,
    MatDialogClose,
    NgIf,
  ],
  providers: [
    provideNativeDateAdapter(),
  ],
  templateUrl: './appointment-form.component.html',
  styleUrl: './appointment-form.component.scss',
})
export class AppointmentFormComponent {
  readonly #fb = inject(FormBuilder);
  readonly #data: AppointmentFormDialogData = inject(MAT_DIALOG_DATA);
  readonly form = this.#fb.group({
    title: this.#fb.control(this.#data.title, Validators.required),
    startDate: this.#fb.control(this.#data.start, [
      Validators.required,
    ]),
    startTime: this.#fb.control(
      this.#data.start.getHours() * 60 + Math.floor(this.#data.start.getMinutes() / 15) * 15,
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(0),
          Validators.max(60 * 24 - 15),
        ],
      },
    ),
    length: this.#fb.control(
      Math.ceil(this.#data.length / 15) * 15,
      {
        nonNullable: true,
        validators: [
          Validators.required,
          Validators.min(15),
          Validators.max(60 * 24),
        ],
      }
    ),
    description: this.#data.description,
    color: this.#data.color,
  });

  readonly startTimes = Array.from({ length: 24 * 60 / 15 }, (_, i) => i * 15);
  readonly lengths = Array.from({ length: 6 * 60 / 15 - 1 }, (_, i) => (i + 1) * 15);
  readonly colors = Object.entries(appointmentColors).map(([ key, value ]) => ({ key, value }));

  readonly #matDialogRef: MatDialogRef<AppointmentFormDialogData, AppointmentFormDialogResult> = inject(MatDialogRef);

  save(): void {
    if (this.form.valid) {
      const result = {
        id: this.#data.id,
        start: new Date(
          this.form.value.startDate!.getFullYear(),
          this.form.value.startDate!.getMonth(),
          this.form.value.startDate!.getDate(),
          Math.floor(this.form.value.startTime! / 60),
          this.form.value.startTime! % 60,
        ),
        length: this.form.value.length!,
        title: this.form.value.title!,
        description: this.form.value.description!,
        color: this.form.value.color!,
      } satisfies Appointment;
      this.#matDialogRef.close(result);
    }
  }

  static open(matDialog: MatDialog, data: AppointmentFormDialogData): Observable<AppointmentFormDialogResult> {
    return matDialog.open(AppointmentFormComponent, { data }).afterClosed();
  }

  protected readonly appointmentColors = appointmentColors;
}

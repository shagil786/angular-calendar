import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { map, Observable } from 'rxjs';

export interface ConfirmDialogData {
  title: string;
  message: string;
  confirmText: string;
  cancelText: string;
}

export type ConfirmDialogResult = boolean;

@Component({
  selector: 'app-confirm',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButton,
  ],
  template: `
    <h3 mat-dialog-title>{{ data.title }}</h3>
    <mat-dialog-content>{{ data.message }}</mat-dialog-content>
    <mat-dialog-actions style="justify-content: end;">
      <button mat-raised-button [mat-dialog-close]="true">{{ data.confirmText }}</button>
      <button mat-raised-button [mat-dialog-close]="false">{{ data.cancelText }}</button>
    </mat-dialog-actions>
  `,
  styles: ``,
})
export class ConfirmComponent {
  readonly data: ConfirmDialogData = inject(MAT_DIALOG_DATA);

  static open(matDialog: MatDialog, options: ConfirmDialogData): Observable<ConfirmDialogResult> {
    return matDialog.open<
      ConfirmComponent,
      ConfirmDialogData,
      ConfirmDialogResult
    >(ConfirmComponent, {
      data: options,
    }).afterClosed().pipe(
      map(result => result ?? false),
    );
  }
}

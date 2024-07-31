import { inject, Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { defer, map, Observable, shareReplay, switchMap } from 'rxjs';

export interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmService {
  readonly #matDialog = inject(MatDialog);
  readonly #component$ = defer(() => import('./confirm.component')).pipe(
    map(module => module.ConfirmComponent),
    shareReplay(1),
  );

  constructor() {
  }

  ask(options: ConfirmOptions): Observable<boolean> {
    return this.#component$.pipe(
      switchMap(ConfirmComponent => ConfirmComponent.open(this.#matDialog, {
        title: options.title ?? 'Confirm',
        message: options.message,
        confirmText: options.confirmText ?? 'Confirm',
        cancelText: options.cancelText ?? 'Cancel',
      })),
    );
  }
}

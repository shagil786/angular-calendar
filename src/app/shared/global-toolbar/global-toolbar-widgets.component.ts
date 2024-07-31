import { GlobalToolbarService } from '@/shared/global-toolbar';
import { AsyncPipe, NgTemplateOutlet } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButton } from '@angular/material/button';
import { MatTooltip } from '@angular/material/tooltip';

@Component({
  selector: 'app-global-toolbar-widgets',
  standalone: true,
  imports: [
    AsyncPipe,
    NgTemplateOutlet,
    MatTooltip,
    MatButton,
  ],
  template: `
    @for (item of items$ | async; track item.id) {
      <ng-container [ngTemplateOutlet]="$any(item.data)"/>
    }
  `,
  styles: `
    :host {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      gap: 8px;
    }
  `,
})
export class GlobalToolbarWidgetsComponent {
  readonly #globalToolbarService = inject(GlobalToolbarService);

  readonly items$ = this.#globalToolbarService.getItemsStream();
}

import { DestroyRef, Directive, inject, TemplateRef } from '@angular/core';
import { GlobalToolbarService } from './global-toolbar.service';

@Directive({
  selector: '[appGlobalToolbarWidget]',
  standalone: true,
})
export class GlobalToolbarWidgetDirective {
  readonly #globalToolbarService = inject(GlobalToolbarService);

  constructor(
    tpl: TemplateRef<unknown>,
  ) {
    inject(DestroyRef).onDestroy(this.#globalToolbarService.addWidget(tpl));
  }
}

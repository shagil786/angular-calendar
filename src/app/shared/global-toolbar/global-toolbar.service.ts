import { Injectable, signal, TemplateRef } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable } from 'rxjs';

type WidgetItem = {
  id: number;
  type: 'widget';
  data: TemplateRef<unknown>;
};

@Injectable({
  providedIn: 'root',
})
export class GlobalToolbarService {
  readonly #items = signal<WidgetItem[]>([]);
  #nextItemId = 1;

  addWidget(tpl: TemplateRef<unknown>): () => void {
    const id = this.#nextItemId++;
    this.#items.update(widgets => [ { id, type: 'widget', data: tpl }, ...widgets ]);
    return () => this.#items.update(buttons => buttons.filter(b => b.id === id));
  }

  getItemsStream(): Observable<ReadonlyArray<Readonly<WidgetItem>>> {
    return toObservable(this.#items);
  }
}

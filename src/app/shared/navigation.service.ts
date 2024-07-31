import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class NavigationService {
  readonly #router = inject(Router);

  goToDate(date: Date | null): void {
    let url = '/day';
    if (date) {
      url += '/' + date.getFullYear() + '-' + (date.getMonth() + 1).toString().padStart(2, '0') + '-' + date.getDate().toString().padStart(2, '0');
    }
    this.#router.navigateByUrl(url);
  }
}

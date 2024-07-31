import { CurrentTimeComponent } from '@/shared/current-time';
import { GlobalToolbarWidgetDirective, GlobalToolbarWidgetsComponent } from '@/shared/global-toolbar';
import { NavigationService } from '@/shared/navigation.service';
import { NextAppointmentComponent } from '@/shared/next-appointment';
import { TotalsComponent } from '@/shared/totals';
import { AsyncPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { MatCalendar } from '@angular/material/datepicker';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbar } from '@angular/material/toolbar';
import { ActivatedRoute, RouterOutlet } from '@angular/router';
import { map } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatToolbar, MatSidenavModule, GlobalToolbarWidgetsComponent, GlobalToolbarWidgetDirective, CurrentTimeComponent, TotalsComponent, NextAppointmentComponent, MatCalendar, AsyncPipe],
  providers: [
    provideNativeDateAdapter(),
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  readonly #route = inject(ActivatedRoute);
  readonly #dateParam$ = this.#route.params.pipe(map(params => params['date']));
  readonly date$ = this.#dateParam$.pipe(map(date => {
    const matches = /^(\d{4})-(\d{2})-(\d{2})$/.exec(date);
    if (matches) {
      return new Date(+matches[1], +matches[2] - 1, +matches[3]);
    } else {
      return new Date();
    }
  }));
  readonly #navigation = inject(NavigationService);

  title = 'calendar';

  redirect(date: Date | null) {
    this.#navigation.goToDate(date);
  }
}

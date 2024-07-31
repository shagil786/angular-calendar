import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatTime',
  standalone: true,
})
export class FormatTimePipe implements PipeTransform {
  transform(time: Date | number | null | undefined): string {
    let timeInMinutes: number;

    if (typeof time === 'number') {
      timeInMinutes = time;
    } else if (time instanceof Date) {
      timeInMinutes = time.getHours() * 60 + time.getMinutes();
    } else {
      return '';
    }

    const hours = Math.floor(timeInMinutes / 60);
    const minutes = timeInMinutes % 60;
    return `${ hours }:${ minutes.toString().padStart(2, '0') }`;
  }
}

import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'base64Decode',
})
export class Base64DecodePipe implements PipeTransform {
  transform(value: string): string {
    try {
      return atob(value.split(',')[1]);
    } catch (e) {
      console.error('Error decoding Base64 string', e);
      return 'Error decoding text';
    }
  }
}

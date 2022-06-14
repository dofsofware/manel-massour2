import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'typedepapier',
})
export class Typedepapier implements PipeTransform {
  transform(value: any): any {
    if (value === 'BAIL') {
      return 'Bail';
    } else if (value === 'DELIBERATION') {
      return 'Délibération';
    } else if (value === 'TITRE_FONCIER') {
      return 'Titre foncier';
    } else {
      return null;
    }
  }
}

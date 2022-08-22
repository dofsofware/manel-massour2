import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'changerpipehome',
})
export class ChangerpipePipeHome implements PipeTransform {
  transform(value: any, ...args: any[]): any {
    if (value === 'MAISON') {
      return 'Maison';
    } else if (value === 'APPARTEMENT') {
      return 'Appartement';
    } else if (value === 'TERRAIN') {
      return 'Terrain';
    } else if (value === 'CHAMBRE') {
      return 'Chambre';
    } else if (value === 'VERGER') {
      return 'Verger';
    } else if (value === 'HANGAR') {
      return 'Hangar';
    } else if (value === 'LOCAL_DE_COMMERCE') {
      return 'local commercial';
    } else if (value === 'BUREAU') {
      return 'Bureau';
    } else if (value === 'LOCATION') {
      return 'Location';
    } else if (value === 'VENDRE') {
      return 'Vente';
    } else if (value === 'BAIL') {
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

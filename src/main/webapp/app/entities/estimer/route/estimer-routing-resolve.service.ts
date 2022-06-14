import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEstimer, Estimer } from '../estimer.model';
import { EstimerService } from '../service/estimer.service';

@Injectable({ providedIn: 'root' })
export class EstimerRoutingResolveService implements Resolve<IEstimer> {
  constructor(protected service: EstimerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEstimer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((estimer: HttpResponse<Estimer>) => {
          if (estimer.body) {
            return of(estimer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Estimer());
  }
}

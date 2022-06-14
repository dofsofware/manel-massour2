import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IAcheter, Acheter } from '../acheter.model';
import { AcheterService } from '../service/acheter.service';

@Injectable({ providedIn: 'root' })
export class AcheterRoutingResolveService implements Resolve<IAcheter> {
  constructor(protected service: AcheterService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IAcheter> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((acheter: HttpResponse<Acheter>) => {
          if (acheter.body) {
            return of(acheter.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Acheter());
  }
}

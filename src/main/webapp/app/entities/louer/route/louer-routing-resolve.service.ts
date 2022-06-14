import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { ILouer, Louer } from '../louer.model';
import { LouerService } from '../service/louer.service';

@Injectable({ providedIn: 'root' })
export class LouerRoutingResolveService implements Resolve<ILouer> {
  constructor(protected service: LouerService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<ILouer> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((louer: HttpResponse<Louer>) => {
          if (louer.body) {
            return of(louer.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Louer());
  }
}

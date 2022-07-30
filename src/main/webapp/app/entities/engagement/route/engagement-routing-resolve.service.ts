import { Injectable } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { Resolve, ActivatedRouteSnapshot, Router } from '@angular/router';
import { Observable, of, EMPTY } from 'rxjs';
import { mergeMap } from 'rxjs/operators';

import { IEngagement, Engagement } from '../engagement.model';
import { EngagementService } from '../service/engagement.service';

@Injectable({ providedIn: 'root' })
export class EngagementRoutingResolveService implements Resolve<IEngagement> {
  constructor(protected service: EngagementService, protected router: Router) {}

  resolve(route: ActivatedRouteSnapshot): Observable<IEngagement> | Observable<never> {
    const id = route.params['id'];
    if (id) {
      return this.service.find(id).pipe(
        mergeMap((engagement: HttpResponse<Engagement>) => {
          if (engagement.body) {
            return of(engagement.body);
          } else {
            this.router.navigate(['404']);
            return EMPTY;
          }
        })
      );
    }
    return of(new Engagement());
  }
}

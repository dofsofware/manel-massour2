import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEstimer, getEstimerIdentifier } from '../estimer.model';

export type EntityResponseType = HttpResponse<IEstimer>;
export type EntityArrayResponseType = HttpResponse<IEstimer[]>;

@Injectable({ providedIn: 'root' })
export class EstimerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/estimers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(estimer: IEstimer): Observable<EntityResponseType> {
    return this.http.post<IEstimer>(this.resourceUrl, estimer, { observe: 'response' });
  }

  update(estimer: IEstimer): Observable<EntityResponseType> {
    return this.http.put<IEstimer>(`${this.resourceUrl}/${getEstimerIdentifier(estimer) as number}`, estimer, { observe: 'response' });
  }

  partialUpdate(estimer: IEstimer): Observable<EntityResponseType> {
    return this.http.patch<IEstimer>(`${this.resourceUrl}/${getEstimerIdentifier(estimer) as number}`, estimer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEstimer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEstimer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEstimerToCollectionIfMissing(estimerCollection: IEstimer[], ...estimersToCheck: (IEstimer | null | undefined)[]): IEstimer[] {
    const estimers: IEstimer[] = estimersToCheck.filter(isPresent);
    if (estimers.length > 0) {
      const estimerCollectionIdentifiers = estimerCollection.map(estimerItem => getEstimerIdentifier(estimerItem)!);
      const estimersToAdd = estimers.filter(estimerItem => {
        const estimerIdentifier = getEstimerIdentifier(estimerItem);
        if (estimerIdentifier == null || estimerCollectionIdentifiers.includes(estimerIdentifier)) {
          return false;
        }
        estimerCollectionIdentifiers.push(estimerIdentifier);
        return true;
      });
      return [...estimersToAdd, ...estimerCollection];
    }
    return estimerCollection;
  }
}

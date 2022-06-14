import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IAcheter, getAcheterIdentifier } from '../acheter.model';

export type EntityResponseType = HttpResponse<IAcheter>;
export type EntityArrayResponseType = HttpResponse<IAcheter[]>;

@Injectable({ providedIn: 'root' })
export class AcheterService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/acheters');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(acheter: IAcheter): Observable<EntityResponseType> {
    return this.http.post<IAcheter>(this.resourceUrl, acheter, { observe: 'response' });
  }

  update(acheter: IAcheter): Observable<EntityResponseType> {
    return this.http.put<IAcheter>(`${this.resourceUrl}/${getAcheterIdentifier(acheter) as number}`, acheter, { observe: 'response' });
  }

  partialUpdate(acheter: IAcheter): Observable<EntityResponseType> {
    return this.http.patch<IAcheter>(`${this.resourceUrl}/${getAcheterIdentifier(acheter) as number}`, acheter, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IAcheter>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IAcheter[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addAcheterToCollectionIfMissing(acheterCollection: IAcheter[], ...achetersToCheck: (IAcheter | null | undefined)[]): IAcheter[] {
    const acheters: IAcheter[] = achetersToCheck.filter(isPresent);
    if (acheters.length > 0) {
      const acheterCollectionIdentifiers = acheterCollection.map(acheterItem => getAcheterIdentifier(acheterItem)!);
      const achetersToAdd = acheters.filter(acheterItem => {
        const acheterIdentifier = getAcheterIdentifier(acheterItem);
        if (acheterIdentifier == null || acheterCollectionIdentifiers.includes(acheterIdentifier)) {
          return false;
        }
        acheterCollectionIdentifiers.push(acheterIdentifier);
        return true;
      });
      return [...achetersToAdd, ...acheterCollection];
    }
    return acheterCollection;
  }
}

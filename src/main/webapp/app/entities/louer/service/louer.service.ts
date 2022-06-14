import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { ILouer, getLouerIdentifier } from '../louer.model';

export type EntityResponseType = HttpResponse<ILouer>;
export type EntityArrayResponseType = HttpResponse<ILouer[]>;

@Injectable({ providedIn: 'root' })
export class LouerService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/louers');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(louer: ILouer): Observable<EntityResponseType> {
    return this.http.post<ILouer>(this.resourceUrl, louer, { observe: 'response' });
  }

  update(louer: ILouer): Observable<EntityResponseType> {
    return this.http.put<ILouer>(`${this.resourceUrl}/${getLouerIdentifier(louer) as number}`, louer, { observe: 'response' });
  }

  partialUpdate(louer: ILouer): Observable<EntityResponseType> {
    return this.http.patch<ILouer>(`${this.resourceUrl}/${getLouerIdentifier(louer) as number}`, louer, { observe: 'response' });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<ILouer>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<ILouer[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addLouerToCollectionIfMissing(louerCollection: ILouer[], ...louersToCheck: (ILouer | null | undefined)[]): ILouer[] {
    const louers: ILouer[] = louersToCheck.filter(isPresent);
    if (louers.length > 0) {
      const louerCollectionIdentifiers = louerCollection.map(louerItem => getLouerIdentifier(louerItem)!);
      const louersToAdd = louers.filter(louerItem => {
        const louerIdentifier = getLouerIdentifier(louerItem);
        if (louerIdentifier == null || louerCollectionIdentifiers.includes(louerIdentifier)) {
          return false;
        }
        louerCollectionIdentifiers.push(louerIdentifier);
        return true;
      });
      return [...louersToAdd, ...louerCollection];
    }
    return louerCollection;
  }
}

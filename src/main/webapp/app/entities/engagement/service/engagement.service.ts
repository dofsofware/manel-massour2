import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { isPresent } from 'app/core/util/operators';
import { ApplicationConfigService } from 'app/core/config/application-config.service';
import { createRequestOption } from 'app/core/request/request-util';
import { IEngagement, getEngagementIdentifier } from '../engagement.model';

export type EntityResponseType = HttpResponse<IEngagement>;
export type EntityArrayResponseType = HttpResponse<IEngagement[]>;

@Injectable({ providedIn: 'root' })
export class EngagementService {
  protected resourceUrl = this.applicationConfigService.getEndpointFor('api/engagements');

  constructor(protected http: HttpClient, protected applicationConfigService: ApplicationConfigService) {}

  create(engagement: IEngagement): Observable<EntityResponseType> {
    return this.http.post<IEngagement>(this.resourceUrl, engagement, { observe: 'response' });
  }

  update(engagement: IEngagement): Observable<EntityResponseType> {
    return this.http.put<IEngagement>(`${this.resourceUrl}/${getEngagementIdentifier(engagement) as number}`, engagement, {
      observe: 'response',
    });
  }

  partialUpdate(engagement: IEngagement): Observable<EntityResponseType> {
    return this.http.patch<IEngagement>(`${this.resourceUrl}/${getEngagementIdentifier(engagement) as number}`, engagement, {
      observe: 'response',
    });
  }

  find(id: number): Observable<EntityResponseType> {
    return this.http.get<IEngagement>(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  query(req?: any): Observable<EntityArrayResponseType> {
    const options = createRequestOption(req);
    return this.http.get<IEngagement[]>(this.resourceUrl, { params: options, observe: 'response' });
  }

  delete(id: number): Observable<HttpResponse<{}>> {
    return this.http.delete(`${this.resourceUrl}/${id}`, { observe: 'response' });
  }

  addEngagementToCollectionIfMissing(
    engagementCollection: IEngagement[],
    ...engagementsToCheck: (IEngagement | null | undefined)[]
  ): IEngagement[] {
    const engagements: IEngagement[] = engagementsToCheck.filter(isPresent);
    if (engagements.length > 0) {
      const engagementCollectionIdentifiers = engagementCollection.map(engagementItem => getEngagementIdentifier(engagementItem)!);
      const engagementsToAdd = engagements.filter(engagementItem => {
        const engagementIdentifier = getEngagementIdentifier(engagementItem);
        if (engagementIdentifier == null || engagementCollectionIdentifiers.includes(engagementIdentifier)) {
          return false;
        }
        engagementCollectionIdentifiers.push(engagementIdentifier);
        return true;
      });
      return [...engagementsToAdd, ...engagementCollection];
    }
    return engagementCollection;
  }
}

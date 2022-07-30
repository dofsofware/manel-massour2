import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEngagement, Engagement } from '../engagement.model';

import { EngagementService } from './engagement.service';

describe('Engagement Service', () => {
  let service: EngagementService;
  let httpMock: HttpTestingController;
  let elemDefault: IEngagement;
  let expectedResult: IEngagement | IEngagement[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EngagementService);
    httpMock = TestBed.inject(HttpTestingController);

    elemDefault = {
      id: 0,
    };
  });

  describe('Service methods', () => {
    it('should find an element', () => {
      const returnedFromService = Object.assign({}, elemDefault);

      service.find(123).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(elemDefault);
    });

    it('should create a Engagement', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Engagement()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Engagement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.update(expected).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PUT' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should partial update a Engagement', () => {
      const patchObject = Object.assign({}, new Engagement());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Engagement', () => {
      const returnedFromService = Object.assign(
        {
          id: 1,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.query().subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'GET' });
      req.flush([returnedFromService]);
      httpMock.verify();
      expect(expectedResult).toContainEqual(expected);
    });

    it('should delete a Engagement', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEngagementToCollectionIfMissing', () => {
      it('should add a Engagement to an empty array', () => {
        const engagement: IEngagement = { id: 123 };
        expectedResult = service.addEngagementToCollectionIfMissing([], engagement);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(engagement);
      });

      it('should not add a Engagement to an array that contains it', () => {
        const engagement: IEngagement = { id: 123 };
        const engagementCollection: IEngagement[] = [
          {
            ...engagement,
          },
          { id: 456 },
        ];
        expectedResult = service.addEngagementToCollectionIfMissing(engagementCollection, engagement);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Engagement to an array that doesn't contain it", () => {
        const engagement: IEngagement = { id: 123 };
        const engagementCollection: IEngagement[] = [{ id: 456 }];
        expectedResult = service.addEngagementToCollectionIfMissing(engagementCollection, engagement);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(engagement);
      });

      it('should add only unique Engagement to an array', () => {
        const engagementArray: IEngagement[] = [{ id: 123 }, { id: 456 }, { id: 28983 }];
        const engagementCollection: IEngagement[] = [{ id: 123 }];
        expectedResult = service.addEngagementToCollectionIfMissing(engagementCollection, ...engagementArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const engagement: IEngagement = { id: 123 };
        const engagement2: IEngagement = { id: 456 };
        expectedResult = service.addEngagementToCollectionIfMissing([], engagement, engagement2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(engagement);
        expect(expectedResult).toContain(engagement2);
      });

      it('should accept null and undefined values', () => {
        const engagement: IEngagement = { id: 123 };
        expectedResult = service.addEngagementToCollectionIfMissing([], null, engagement, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(engagement);
      });

      it('should return initial array if no Engagement is added', () => {
        const engagementCollection: IEngagement[] = [{ id: 123 }];
        expectedResult = service.addEngagementToCollectionIfMissing(engagementCollection, undefined, null);
        expect(expectedResult).toEqual(engagementCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

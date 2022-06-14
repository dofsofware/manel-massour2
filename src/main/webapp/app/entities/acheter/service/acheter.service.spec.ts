import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IAcheter, Acheter } from '../acheter.model';

import { AcheterService } from './acheter.service';

describe('Acheter Service', () => {
  let service: AcheterService;
  let httpMock: HttpTestingController;
  let elemDefault: IAcheter;
  let expectedResult: IAcheter | IAcheter[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(AcheterService);
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

    it('should create a Acheter', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Acheter()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Acheter', () => {
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

    it('should partial update a Acheter', () => {
      const patchObject = Object.assign({}, new Acheter());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Acheter', () => {
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

    it('should delete a Acheter', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addAcheterToCollectionIfMissing', () => {
      it('should add a Acheter to an empty array', () => {
        const acheter: IAcheter = { id: 123 };
        expectedResult = service.addAcheterToCollectionIfMissing([], acheter);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(acheter);
      });

      it('should not add a Acheter to an array that contains it', () => {
        const acheter: IAcheter = { id: 123 };
        const acheterCollection: IAcheter[] = [
          {
            ...acheter,
          },
          { id: 456 },
        ];
        expectedResult = service.addAcheterToCollectionIfMissing(acheterCollection, acheter);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Acheter to an array that doesn't contain it", () => {
        const acheter: IAcheter = { id: 123 };
        const acheterCollection: IAcheter[] = [{ id: 456 }];
        expectedResult = service.addAcheterToCollectionIfMissing(acheterCollection, acheter);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(acheter);
      });

      it('should add only unique Acheter to an array', () => {
        const acheterArray: IAcheter[] = [{ id: 123 }, { id: 456 }, { id: 50738 }];
        const acheterCollection: IAcheter[] = [{ id: 123 }];
        expectedResult = service.addAcheterToCollectionIfMissing(acheterCollection, ...acheterArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const acheter: IAcheter = { id: 123 };
        const acheter2: IAcheter = { id: 456 };
        expectedResult = service.addAcheterToCollectionIfMissing([], acheter, acheter2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(acheter);
        expect(expectedResult).toContain(acheter2);
      });

      it('should accept null and undefined values', () => {
        const acheter: IAcheter = { id: 123 };
        expectedResult = service.addAcheterToCollectionIfMissing([], null, acheter, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(acheter);
      });

      it('should return initial array if no Acheter is added', () => {
        const acheterCollection: IAcheter[] = [{ id: 123 }];
        expectedResult = service.addAcheterToCollectionIfMissing(acheterCollection, undefined, null);
        expect(expectedResult).toEqual(acheterCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

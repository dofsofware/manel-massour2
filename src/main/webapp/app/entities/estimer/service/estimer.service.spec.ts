import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { IEstimer, Estimer } from '../estimer.model';

import { EstimerService } from './estimer.service';

describe('Estimer Service', () => {
  let service: EstimerService;
  let httpMock: HttpTestingController;
  let elemDefault: IEstimer;
  let expectedResult: IEstimer | IEstimer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(EstimerService);
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

    it('should create a Estimer', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Estimer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Estimer', () => {
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

    it('should partial update a Estimer', () => {
      const patchObject = Object.assign({}, new Estimer());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Estimer', () => {
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

    it('should delete a Estimer', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addEstimerToCollectionIfMissing', () => {
      it('should add a Estimer to an empty array', () => {
        const estimer: IEstimer = { id: 123 };
        expectedResult = service.addEstimerToCollectionIfMissing([], estimer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimer);
      });

      it('should not add a Estimer to an array that contains it', () => {
        const estimer: IEstimer = { id: 123 };
        const estimerCollection: IEstimer[] = [
          {
            ...estimer,
          },
          { id: 456 },
        ];
        expectedResult = service.addEstimerToCollectionIfMissing(estimerCollection, estimer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Estimer to an array that doesn't contain it", () => {
        const estimer: IEstimer = { id: 123 };
        const estimerCollection: IEstimer[] = [{ id: 456 }];
        expectedResult = service.addEstimerToCollectionIfMissing(estimerCollection, estimer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimer);
      });

      it('should add only unique Estimer to an array', () => {
        const estimerArray: IEstimer[] = [{ id: 123 }, { id: 456 }, { id: 48631 }];
        const estimerCollection: IEstimer[] = [{ id: 123 }];
        expectedResult = service.addEstimerToCollectionIfMissing(estimerCollection, ...estimerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const estimer: IEstimer = { id: 123 };
        const estimer2: IEstimer = { id: 456 };
        expectedResult = service.addEstimerToCollectionIfMissing([], estimer, estimer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(estimer);
        expect(expectedResult).toContain(estimer2);
      });

      it('should accept null and undefined values', () => {
        const estimer: IEstimer = { id: 123 };
        expectedResult = service.addEstimerToCollectionIfMissing([], null, estimer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(estimer);
      });

      it('should return initial array if no Estimer is added', () => {
        const estimerCollection: IEstimer[] = [{ id: 123 }];
        expectedResult = service.addEstimerToCollectionIfMissing(estimerCollection, undefined, null);
        expect(expectedResult).toEqual(estimerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

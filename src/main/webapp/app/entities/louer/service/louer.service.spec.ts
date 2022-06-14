import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';

import { ILouer, Louer } from '../louer.model';

import { LouerService } from './louer.service';

describe('Louer Service', () => {
  let service: LouerService;
  let httpMock: HttpTestingController;
  let elemDefault: ILouer;
  let expectedResult: ILouer | ILouer[] | boolean | null;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
    });
    expectedResult = null;
    service = TestBed.inject(LouerService);
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

    it('should create a Louer', () => {
      const returnedFromService = Object.assign(
        {
          id: 0,
        },
        elemDefault
      );

      const expected = Object.assign({}, returnedFromService);

      service.create(new Louer()).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'POST' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should update a Louer', () => {
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

    it('should partial update a Louer', () => {
      const patchObject = Object.assign({}, new Louer());

      const returnedFromService = Object.assign(patchObject, elemDefault);

      const expected = Object.assign({}, returnedFromService);

      service.partialUpdate(patchObject).subscribe(resp => (expectedResult = resp.body));

      const req = httpMock.expectOne({ method: 'PATCH' });
      req.flush(returnedFromService);
      expect(expectedResult).toMatchObject(expected);
    });

    it('should return a list of Louer', () => {
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

    it('should delete a Louer', () => {
      service.delete(123).subscribe(resp => (expectedResult = resp.ok));

      const req = httpMock.expectOne({ method: 'DELETE' });
      req.flush({ status: 200 });
      expect(expectedResult);
    });

    describe('addLouerToCollectionIfMissing', () => {
      it('should add a Louer to an empty array', () => {
        const louer: ILouer = { id: 123 };
        expectedResult = service.addLouerToCollectionIfMissing([], louer);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(louer);
      });

      it('should not add a Louer to an array that contains it', () => {
        const louer: ILouer = { id: 123 };
        const louerCollection: ILouer[] = [
          {
            ...louer,
          },
          { id: 456 },
        ];
        expectedResult = service.addLouerToCollectionIfMissing(louerCollection, louer);
        expect(expectedResult).toHaveLength(2);
      });

      it("should add a Louer to an array that doesn't contain it", () => {
        const louer: ILouer = { id: 123 };
        const louerCollection: ILouer[] = [{ id: 456 }];
        expectedResult = service.addLouerToCollectionIfMissing(louerCollection, louer);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(louer);
      });

      it('should add only unique Louer to an array', () => {
        const louerArray: ILouer[] = [{ id: 123 }, { id: 456 }, { id: 38558 }];
        const louerCollection: ILouer[] = [{ id: 123 }];
        expectedResult = service.addLouerToCollectionIfMissing(louerCollection, ...louerArray);
        expect(expectedResult).toHaveLength(3);
      });

      it('should accept varargs', () => {
        const louer: ILouer = { id: 123 };
        const louer2: ILouer = { id: 456 };
        expectedResult = service.addLouerToCollectionIfMissing([], louer, louer2);
        expect(expectedResult).toHaveLength(2);
        expect(expectedResult).toContain(louer);
        expect(expectedResult).toContain(louer2);
      });

      it('should accept null and undefined values', () => {
        const louer: ILouer = { id: 123 };
        expectedResult = service.addLouerToCollectionIfMissing([], null, louer, undefined);
        expect(expectedResult).toHaveLength(1);
        expect(expectedResult).toContain(louer);
      });

      it('should return initial array if no Louer is added', () => {
        const louerCollection: ILouer[] = [{ id: 123 }];
        expectedResult = service.addLouerToCollectionIfMissing(louerCollection, undefined, null);
        expect(expectedResult).toEqual(louerCollection);
      });
    });
  });

  afterEach(() => {
    httpMock.verify();
  });
});

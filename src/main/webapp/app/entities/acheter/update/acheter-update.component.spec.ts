import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { AcheterService } from '../service/acheter.service';
import { IAcheter, Acheter } from '../acheter.model';

import { AcheterUpdateComponent } from './acheter-update.component';

describe('Acheter Management Update Component', () => {
  let comp: AcheterUpdateComponent;
  let fixture: ComponentFixture<AcheterUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let acheterService: AcheterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [AcheterUpdateComponent],
      providers: [
        FormBuilder,
        {
          provide: ActivatedRoute,
          useValue: {
            params: from([{}]),
          },
        },
      ],
    })
      .overrideTemplate(AcheterUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AcheterUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    acheterService = TestBed.inject(AcheterService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const acheter: IAcheter = { id: 456 };

      activatedRoute.data = of({ acheter });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(acheter));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Acheter>>();
      const acheter = { id: 123 };
      jest.spyOn(acheterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ acheter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: acheter }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(acheterService.update).toHaveBeenCalledWith(acheter);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Acheter>>();
      const acheter = new Acheter();
      jest.spyOn(acheterService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ acheter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: acheter }));
      saveSubject.complete();

      // THEN
      expect(acheterService.create).toHaveBeenCalledWith(acheter);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Acheter>>();
      const acheter = { id: 123 };
      jest.spyOn(acheterService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ acheter });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(acheterService.update).toHaveBeenCalledWith(acheter);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EstimerService } from '../service/estimer.service';
import { IEstimer, Estimer } from '../estimer.model';

import { EstimerUpdateComponent } from './estimer-update.component';

describe('Estimer Management Update Component', () => {
  let comp: EstimerUpdateComponent;
  let fixture: ComponentFixture<EstimerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let estimerService: EstimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EstimerUpdateComponent],
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
      .overrideTemplate(EstimerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstimerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    estimerService = TestBed.inject(EstimerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const estimer: IEstimer = { id: 456 };

      activatedRoute.data = of({ estimer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(estimer));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estimer>>();
      const estimer = { id: 123 };
      jest.spyOn(estimerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(estimerService.update).toHaveBeenCalledWith(estimer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estimer>>();
      const estimer = new Estimer();
      jest.spyOn(estimerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: estimer }));
      saveSubject.complete();

      // THEN
      expect(estimerService.create).toHaveBeenCalledWith(estimer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Estimer>>();
      const estimer = { id: 123 };
      jest.spyOn(estimerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ estimer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(estimerService.update).toHaveBeenCalledWith(estimer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { LouerService } from '../service/louer.service';
import { ILouer, Louer } from '../louer.model';

import { LouerUpdateComponent } from './louer-update.component';

describe('Louer Management Update Component', () => {
  let comp: LouerUpdateComponent;
  let fixture: ComponentFixture<LouerUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let louerService: LouerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [LouerUpdateComponent],
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
      .overrideTemplate(LouerUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LouerUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    louerService = TestBed.inject(LouerService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const louer: ILouer = { id: 456 };

      activatedRoute.data = of({ louer });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(louer));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Louer>>();
      const louer = { id: 123 };
      jest.spyOn(louerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ louer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: louer }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(louerService.update).toHaveBeenCalledWith(louer);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Louer>>();
      const louer = new Louer();
      jest.spyOn(louerService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ louer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: louer }));
      saveSubject.complete();

      // THEN
      expect(louerService.create).toHaveBeenCalledWith(louer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Louer>>();
      const louer = { id: 123 };
      jest.spyOn(louerService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ louer });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(louerService.update).toHaveBeenCalledWith(louer);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

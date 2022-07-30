import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { of, Subject, from } from 'rxjs';

import { EngagementService } from '../service/engagement.service';
import { IEngagement, Engagement } from '../engagement.model';

import { EngagementUpdateComponent } from './engagement-update.component';

describe('Engagement Management Update Component', () => {
  let comp: EngagementUpdateComponent;
  let fixture: ComponentFixture<EngagementUpdateComponent>;
  let activatedRoute: ActivatedRoute;
  let engagementService: EngagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, RouterTestingModule.withRoutes([])],
      declarations: [EngagementUpdateComponent],
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
      .overrideTemplate(EngagementUpdateComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EngagementUpdateComponent);
    activatedRoute = TestBed.inject(ActivatedRoute);
    engagementService = TestBed.inject(EngagementService);

    comp = fixture.componentInstance;
  });

  describe('ngOnInit', () => {
    it('Should update editForm', () => {
      const engagement: IEngagement = { id: 456 };

      activatedRoute.data = of({ engagement });
      comp.ngOnInit();

      expect(comp.editForm.value).toEqual(expect.objectContaining(engagement));
    });
  });

  describe('save', () => {
    it('Should call update service on save for existing entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Engagement>>();
      const engagement = { id: 123 };
      jest.spyOn(engagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ engagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: engagement }));
      saveSubject.complete();

      // THEN
      expect(comp.previousState).toHaveBeenCalled();
      expect(engagementService.update).toHaveBeenCalledWith(engagement);
      expect(comp.isSaving).toEqual(false);
    });

    it('Should call create service on save for new entity', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Engagement>>();
      const engagement = new Engagement();
      jest.spyOn(engagementService, 'create').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ engagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.next(new HttpResponse({ body: engagement }));
      saveSubject.complete();

      // THEN
      expect(engagementService.create).toHaveBeenCalledWith(engagement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).toHaveBeenCalled();
    });

    it('Should set isSaving to false on error', () => {
      // GIVEN
      const saveSubject = new Subject<HttpResponse<Engagement>>();
      const engagement = { id: 123 };
      jest.spyOn(engagementService, 'update').mockReturnValue(saveSubject);
      jest.spyOn(comp, 'previousState');
      activatedRoute.data = of({ engagement });
      comp.ngOnInit();

      // WHEN
      comp.save();
      expect(comp.isSaving).toEqual(true);
      saveSubject.error('This is an error!');

      // THEN
      expect(engagementService.update).toHaveBeenCalledWith(engagement);
      expect(comp.isSaving).toEqual(false);
      expect(comp.previousState).not.toHaveBeenCalled();
    });
  });
});

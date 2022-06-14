import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EstimerDetailComponent } from './estimer-detail.component';

describe('Estimer Management Detail Component', () => {
  let comp: EstimerDetailComponent;
  let fixture: ComponentFixture<EstimerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EstimerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ estimer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EstimerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EstimerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load estimer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.estimer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

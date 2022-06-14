import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { LouerDetailComponent } from './louer-detail.component';

describe('Louer Management Detail Component', () => {
  let comp: LouerDetailComponent;
  let fixture: ComponentFixture<LouerDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [LouerDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ louer: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(LouerDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(LouerDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load louer on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.louer).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

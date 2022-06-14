import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { AcheterDetailComponent } from './acheter-detail.component';

describe('Acheter Management Detail Component', () => {
  let comp: AcheterDetailComponent;
  let fixture: ComponentFixture<AcheterDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [AcheterDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ acheter: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(AcheterDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(AcheterDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load acheter on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.acheter).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

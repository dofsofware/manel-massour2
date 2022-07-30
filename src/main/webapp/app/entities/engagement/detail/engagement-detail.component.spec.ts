import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

import { EngagementDetailComponent } from './engagement-detail.component';

describe('Engagement Management Detail Component', () => {
  let comp: EngagementDetailComponent;
  let fixture: ComponentFixture<EngagementDetailComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EngagementDetailComponent],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: { data: of({ engagement: { id: 123 } }) },
        },
      ],
    })
      .overrideTemplate(EngagementDetailComponent, '')
      .compileComponents();
    fixture = TestBed.createComponent(EngagementDetailComponent);
    comp = fixture.componentInstance;
  });

  describe('OnInit', () => {
    it('Should load engagement on init', () => {
      // WHEN
      comp.ngOnInit();

      // THEN
      expect(comp.engagement).toEqual(expect.objectContaining({ id: 123 }));
    });
  });
});

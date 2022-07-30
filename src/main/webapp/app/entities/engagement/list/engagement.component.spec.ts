import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EngagementService } from '../service/engagement.service';

import { EngagementComponent } from './engagement.component';

describe('Engagement Management Component', () => {
  let comp: EngagementComponent;
  let fixture: ComponentFixture<EngagementComponent>;
  let service: EngagementService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EngagementComponent],
    })
      .overrideTemplate(EngagementComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EngagementComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EngagementService);

    const headers = new HttpHeaders();
    jest.spyOn(service, 'query').mockReturnValue(
      of(
        new HttpResponse({
          body: [{ id: 123 }],
          headers,
        })
      )
    );
  });

  it('Should call load all on init', () => {
    // WHEN
    comp.ngOnInit();

    // THEN
    expect(service.query).toHaveBeenCalled();
    expect(comp.engagements?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

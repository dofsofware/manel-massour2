import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { AcheterService } from '../service/acheter.service';

import { AcheterComponent } from './acheter.component';

describe('Acheter Management Component', () => {
  let comp: AcheterComponent;
  let fixture: ComponentFixture<AcheterComponent>;
  let service: AcheterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [AcheterComponent],
    })
      .overrideTemplate(AcheterComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(AcheterComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(AcheterService);

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
    expect(comp.acheters?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

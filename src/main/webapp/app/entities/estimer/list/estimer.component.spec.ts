import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { EstimerService } from '../service/estimer.service';

import { EstimerComponent } from './estimer.component';

describe('Estimer Management Component', () => {
  let comp: EstimerComponent;
  let fixture: ComponentFixture<EstimerComponent>;
  let service: EstimerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [EstimerComponent],
    })
      .overrideTemplate(EstimerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(EstimerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(EstimerService);

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
    expect(comp.estimers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

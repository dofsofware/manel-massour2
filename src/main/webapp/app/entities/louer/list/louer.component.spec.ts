import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpHeaders, HttpResponse } from '@angular/common/http';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { of } from 'rxjs';

import { LouerService } from '../service/louer.service';

import { LouerComponent } from './louer.component';

describe('Louer Management Component', () => {
  let comp: LouerComponent;
  let fixture: ComponentFixture<LouerComponent>;
  let service: LouerService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      declarations: [LouerComponent],
    })
      .overrideTemplate(LouerComponent, '')
      .compileComponents();

    fixture = TestBed.createComponent(LouerComponent);
    comp = fixture.componentInstance;
    service = TestBed.inject(LouerService);

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
    expect(comp.louers?.[0]).toEqual(expect.objectContaining({ id: 123 }));
  });
});

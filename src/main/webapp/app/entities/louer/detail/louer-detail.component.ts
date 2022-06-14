import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { ILouer } from '../louer.model';

@Component({
  selector: 'jhi-louer-detail',
  templateUrl: './louer-detail.component.html',
})
export class LouerDetailComponent implements OnInit {
  louer: ILouer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ louer }) => {
      this.louer = louer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

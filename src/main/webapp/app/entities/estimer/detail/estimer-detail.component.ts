import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEstimer } from '../estimer.model';

@Component({
  selector: 'jhi-estimer-detail',
  templateUrl: './estimer-detail.component.html',
})
export class EstimerDetailComponent implements OnInit {
  estimer: IEstimer | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estimer }) => {
      this.estimer = estimer;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

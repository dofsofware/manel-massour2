import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IAcheter } from '../acheter.model';

@Component({
  selector: 'jhi-acheter-detail',
  templateUrl: './acheter-detail.component.html',
})
export class AcheterDetailComponent implements OnInit {
  acheter: IAcheter | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ acheter }) => {
      this.acheter = acheter;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

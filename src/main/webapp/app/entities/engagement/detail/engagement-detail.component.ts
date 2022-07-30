import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { IEngagement } from '../engagement.model';

@Component({
  selector: 'jhi-engagement-detail',
  templateUrl: './engagement-detail.component.html',
})
export class EngagementDetailComponent implements OnInit {
  engagement: IEngagement | null = null;

  constructor(protected activatedRoute: ActivatedRoute) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ engagement }) => {
      this.engagement = engagement;
    });
  }

  previousState(): void {
    window.history.back();
  }
}

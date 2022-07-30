import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEngagement, Engagement } from '../engagement.model';
import { EngagementService } from '../service/engagement.service';

@Component({
  selector: 'jhi-engagement-update',
  templateUrl: './engagement-update.component.html',
})
export class EngagementUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected engagementService: EngagementService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ engagement }) => {
      this.updateForm(engagement);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const engagement = this.createFromForm();
    if (engagement.id !== undefined) {
      this.subscribeToSaveResponse(this.engagementService.update(engagement));
    } else {
      this.subscribeToSaveResponse(this.engagementService.create(engagement));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEngagement>>): void {
    result.pipe(finalize(() => this.onSaveFinalize())).subscribe({
      next: () => this.onSaveSuccess(),
      error: () => this.onSaveError(),
    });
  }

  protected onSaveSuccess(): void {
    this.previousState();
  }

  protected onSaveError(): void {
    // Api for inheritance.
  }

  protected onSaveFinalize(): void {
    this.isSaving = false;
  }

  protected updateForm(engagement: IEngagement): void {
    this.editForm.patchValue({
      id: engagement.id,
    });
  }

  protected createFromForm(): IEngagement {
    return {
      ...new Engagement(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}

import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IAcheter, Acheter } from '../acheter.model';
import { AcheterService } from '../service/acheter.service';

@Component({
  selector: 'jhi-acheter-update',
  templateUrl: './acheter-update.component.html',
})
export class AcheterUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected acheterService: AcheterService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ acheter }) => {
      this.updateForm(acheter);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const acheter = this.createFromForm();
    if (acheter.id !== undefined) {
      this.subscribeToSaveResponse(this.acheterService.update(acheter));
    } else {
      this.subscribeToSaveResponse(this.acheterService.create(acheter));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IAcheter>>): void {
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

  protected updateForm(acheter: IAcheter): void {
    this.editForm.patchValue({
      id: acheter.id,
    });
  }

  protected createFromForm(): IAcheter {
    return {
      ...new Acheter(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}

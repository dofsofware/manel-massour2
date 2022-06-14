import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { IEstimer, Estimer } from '../estimer.model';
import { EstimerService } from '../service/estimer.service';

@Component({
  selector: 'jhi-estimer-update',
  templateUrl: './estimer-update.component.html',
})
export class EstimerUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected estimerService: EstimerService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ estimer }) => {
      this.updateForm(estimer);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const estimer = this.createFromForm();
    if (estimer.id !== undefined) {
      this.subscribeToSaveResponse(this.estimerService.update(estimer));
    } else {
      this.subscribeToSaveResponse(this.estimerService.create(estimer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<IEstimer>>): void {
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

  protected updateForm(estimer: IEstimer): void {
    this.editForm.patchValue({
      id: estimer.id,
    });
  }

  protected createFromForm(): IEstimer {
    return {
      ...new Estimer(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}

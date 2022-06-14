import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';

import { ILouer, Louer } from '../louer.model';
import { LouerService } from '../service/louer.service';

@Component({
  selector: 'jhi-louer-update',
  templateUrl: './louer-update.component.html',
})
export class LouerUpdateComponent implements OnInit {
  isSaving = false;

  editForm = this.fb.group({
    id: [],
  });

  constructor(protected louerService: LouerService, protected activatedRoute: ActivatedRoute, protected fb: FormBuilder) {}

  ngOnInit(): void {
    this.activatedRoute.data.subscribe(({ louer }) => {
      this.updateForm(louer);
    });
  }

  previousState(): void {
    window.history.back();
  }

  save(): void {
    this.isSaving = true;
    const louer = this.createFromForm();
    if (louer.id !== undefined) {
      this.subscribeToSaveResponse(this.louerService.update(louer));
    } else {
      this.subscribeToSaveResponse(this.louerService.create(louer));
    }
  }

  protected subscribeToSaveResponse(result: Observable<HttpResponse<ILouer>>): void {
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

  protected updateForm(louer: ILouer): void {
    this.editForm.patchValue({
      id: louer.id,
    });
  }

  protected createFromForm(): ILouer {
    return {
      ...new Louer(),
      id: this.editForm.get(['id'])!.value,
    };
  }
}

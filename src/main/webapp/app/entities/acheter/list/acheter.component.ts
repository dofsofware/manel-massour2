import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IAcheter } from '../acheter.model';
import { AcheterService } from '../service/acheter.service';
import { AcheterDeleteDialogComponent } from '../delete/acheter-delete-dialog.component';

@Component({
  selector: 'jhi-acheter',
  templateUrl: './acheter.component.html',
})
export class AcheterComponent implements OnInit {
  acheters?: IAcheter[];
  isLoading = false;

  constructor(protected acheterService: AcheterService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.acheterService.query().subscribe({
      next: (res: HttpResponse<IAcheter[]>) => {
        this.isLoading = false;
        this.acheters = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IAcheter): number {
    return item.id!;
  }

  delete(acheter: IAcheter): void {
    const modalRef = this.modalService.open(AcheterDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.acheter = acheter;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

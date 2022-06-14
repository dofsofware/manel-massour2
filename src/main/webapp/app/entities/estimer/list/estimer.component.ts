import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstimer } from '../estimer.model';
import { EstimerService } from '../service/estimer.service';
import { EstimerDeleteDialogComponent } from '../delete/estimer-delete-dialog.component';

@Component({
  selector: 'jhi-estimer',
  templateUrl: './estimer.component.html',
})
export class EstimerComponent implements OnInit {
  estimers?: IEstimer[];
  isLoading = false;

  constructor(protected estimerService: EstimerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.estimerService.query().subscribe({
      next: (res: HttpResponse<IEstimer[]>) => {
        this.isLoading = false;
        this.estimers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: IEstimer): number {
    return item.id!;
  }

  delete(estimer: IEstimer): void {
    const modalRef = this.modalService.open(EstimerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.estimer = estimer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

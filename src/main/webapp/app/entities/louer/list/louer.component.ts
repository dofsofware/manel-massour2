import { Component, OnInit } from '@angular/core';
import { HttpResponse } from '@angular/common/http';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';

import { ILouer } from '../louer.model';
import { LouerService } from '../service/louer.service';
import { LouerDeleteDialogComponent } from '../delete/louer-delete-dialog.component';

@Component({
  selector: 'jhi-louer',
  templateUrl: './louer.component.html',
})
export class LouerComponent implements OnInit {
  louers?: ILouer[];
  isLoading = false;

  constructor(protected louerService: LouerService, protected modalService: NgbModal) {}

  loadAll(): void {
    this.isLoading = true;

    this.louerService.query().subscribe({
      next: (res: HttpResponse<ILouer[]>) => {
        this.isLoading = false;
        this.louers = res.body ?? [];
      },
      error: () => {
        this.isLoading = false;
      },
    });
  }

  ngOnInit(): void {
    this.loadAll();
  }

  trackId(_index: number, item: ILouer): number {
    return item.id!;
  }

  delete(louer: ILouer): void {
    const modalRef = this.modalService.open(LouerDeleteDialogComponent, { size: 'lg', backdrop: 'static' });
    modalRef.componentInstance.louer = louer;
    // unsubscribe not needed because closed completes on modal close
    modalRef.closed.subscribe(reason => {
      if (reason === 'deleted') {
        this.loadAll();
      }
    });
  }
}

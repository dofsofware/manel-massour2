import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEstimer } from '../estimer.model';
import { EstimerService } from '../service/estimer.service';

@Component({
  templateUrl: './estimer-delete-dialog.component.html',
})
export class EstimerDeleteDialogComponent {
  estimer?: IEstimer;

  constructor(protected estimerService: EstimerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.estimerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

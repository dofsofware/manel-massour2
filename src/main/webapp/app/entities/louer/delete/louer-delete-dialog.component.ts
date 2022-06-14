import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { ILouer } from '../louer.model';
import { LouerService } from '../service/louer.service';

@Component({
  templateUrl: './louer-delete-dialog.component.html',
})
export class LouerDeleteDialogComponent {
  louer?: ILouer;

  constructor(protected louerService: LouerService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.louerService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IAcheter } from '../acheter.model';
import { AcheterService } from '../service/acheter.service';

@Component({
  templateUrl: './acheter-delete-dialog.component.html',
})
export class AcheterDeleteDialogComponent {
  acheter?: IAcheter;

  constructor(protected acheterService: AcheterService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.acheterService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

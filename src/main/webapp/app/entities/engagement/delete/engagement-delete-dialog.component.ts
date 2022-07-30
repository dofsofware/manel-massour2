import { Component } from '@angular/core';
import { NgbActiveModal } from '@ng-bootstrap/ng-bootstrap';

import { IEngagement } from '../engagement.model';
import { EngagementService } from '../service/engagement.service';

@Component({
  templateUrl: './engagement-delete-dialog.component.html',
})
export class EngagementDeleteDialogComponent {
  engagement?: IEngagement;

  constructor(protected engagementService: EngagementService, protected activeModal: NgbActiveModal) {}

  cancel(): void {
    this.activeModal.dismiss();
  }

  confirmDelete(id: number): void {
    this.engagementService.delete(id).subscribe(() => {
      this.activeModal.close('deleted');
    });
  }
}

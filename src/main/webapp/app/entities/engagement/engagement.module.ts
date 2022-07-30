import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EngagementComponent } from './list/engagement.component';
import { EngagementDetailComponent } from './detail/engagement-detail.component';
import { EngagementUpdateComponent } from './update/engagement-update.component';
import { EngagementDeleteDialogComponent } from './delete/engagement-delete-dialog.component';
import { EngagementRoutingModule } from './route/engagement-routing.module';

@NgModule({
  imports: [SharedModule, EngagementRoutingModule],
  declarations: [EngagementComponent, EngagementDetailComponent, EngagementUpdateComponent, EngagementDeleteDialogComponent],
  entryComponents: [EngagementDeleteDialogComponent],
})
export class EngagementModule {}

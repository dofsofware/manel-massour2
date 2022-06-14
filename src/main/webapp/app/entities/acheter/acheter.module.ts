import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { AcheterComponent } from './list/acheter.component';
import { AcheterDetailComponent } from './detail/acheter-detail.component';
import { AcheterUpdateComponent } from './update/acheter-update.component';
import { AcheterDeleteDialogComponent } from './delete/acheter-delete-dialog.component';
import { AcheterRoutingModule } from './route/acheter-routing.module';

@NgModule({
  imports: [SharedModule, AcheterRoutingModule],
  declarations: [AcheterComponent, AcheterDetailComponent, AcheterUpdateComponent, AcheterDeleteDialogComponent],
  entryComponents: [AcheterDeleteDialogComponent],
})
export class AcheterModule {}

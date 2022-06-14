import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { EstimerComponent } from './list/estimer.component';
import { EstimerDetailComponent } from './detail/estimer-detail.component';
import { EstimerUpdateComponent } from './update/estimer-update.component';
import { EstimerDeleteDialogComponent } from './delete/estimer-delete-dialog.component';
import { EstimerRoutingModule } from './route/estimer-routing.module';

@NgModule({
  imports: [SharedModule, EstimerRoutingModule],
  declarations: [EstimerComponent, EstimerDetailComponent, EstimerUpdateComponent, EstimerDeleteDialogComponent],
  entryComponents: [EstimerDeleteDialogComponent],
})
export class EstimerModule {}

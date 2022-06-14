import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { LouerComponent } from './list/louer.component';
import { LouerDetailComponent } from './detail/louer-detail.component';
import { LouerUpdateComponent } from './update/louer-update.component';
import { LouerDeleteDialogComponent } from './delete/louer-delete-dialog.component';
import { LouerRoutingModule } from './route/louer-routing.module';

@NgModule({
  imports: [SharedModule, LouerRoutingModule],
  declarations: [LouerComponent, LouerDetailComponent, LouerUpdateComponent, LouerDeleteDialogComponent],
  entryComponents: [LouerDeleteDialogComponent],
})
export class LouerModule {}

import { NgModule } from '@angular/core';
import { SharedModule } from 'app/shared/shared.module';
import { RechercheComponent } from './list/recherche.component';
import { RechercheDetailComponent } from './detail/recherche-detail.component';
import { RechercheUpdateComponent } from './update/recherche-update.component';
import { RechercheDeleteDialogComponent } from './delete/recherche-delete-dialog.component';
import { RechercheRoutingModule } from './route/recherche-routing.module';
import { ChangerpipePipe } from 'app/changerpipe.pipe';
import { Typedepapier } from 'app/typedepapierpipe.pipe';

@NgModule({
  imports: [SharedModule, RechercheRoutingModule],
  declarations: [
    RechercheComponent,
    RechercheDetailComponent,
    RechercheUpdateComponent,
    RechercheDeleteDialogComponent,
    ChangerpipePipe,
    Typedepapier,
  ],
  entryComponents: [RechercheDeleteDialogComponent],
  providers: [ChangerpipePipe],
})
export class RechercheModule {}

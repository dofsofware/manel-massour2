import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EstimerComponent } from '../list/estimer.component';
import { EstimerDetailComponent } from '../detail/estimer-detail.component';
import { EstimerUpdateComponent } from '../update/estimer-update.component';
import { EstimerRoutingResolveService } from './estimer-routing-resolve.service';

const estimerRoute: Routes = [
  {
    path: '',
    component: EstimerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EstimerDetailComponent,
    resolve: {
      estimer: EstimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EstimerUpdateComponent,
    resolve: {
      estimer: EstimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EstimerUpdateComponent,
    resolve: {
      estimer: EstimerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(estimerRoute)],
  exports: [RouterModule],
})
export class EstimerRoutingModule {}

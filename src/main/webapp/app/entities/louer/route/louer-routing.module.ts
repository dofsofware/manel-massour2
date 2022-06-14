import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { LouerComponent } from '../list/louer.component';
import { LouerDetailComponent } from '../detail/louer-detail.component';
import { LouerUpdateComponent } from '../update/louer-update.component';
import { LouerRoutingResolveService } from './louer-routing-resolve.service';

const louerRoute: Routes = [
  {
    path: '',
    component: LouerComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: LouerDetailComponent,
    resolve: {
      louer: LouerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: LouerUpdateComponent,
    resolve: {
      louer: LouerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: LouerUpdateComponent,
    resolve: {
      louer: LouerRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(louerRoute)],
  exports: [RouterModule],
})
export class LouerRoutingModule {}

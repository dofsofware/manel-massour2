import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { AcheterComponent } from '../list/acheter.component';
import { AcheterDetailComponent } from '../detail/acheter-detail.component';
import { AcheterUpdateComponent } from '../update/acheter-update.component';
import { AcheterRoutingResolveService } from './acheter-routing-resolve.service';

const acheterRoute: Routes = [
  {
    path: '',
    component: AcheterComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: AcheterDetailComponent,
    resolve: {
      acheter: AcheterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: AcheterUpdateComponent,
    resolve: {
      acheter: AcheterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: AcheterUpdateComponent,
    resolve: {
      acheter: AcheterRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(acheterRoute)],
  exports: [RouterModule],
})
export class AcheterRoutingModule {}

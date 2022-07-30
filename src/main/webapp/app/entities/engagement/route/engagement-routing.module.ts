import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { UserRouteAccessService } from 'app/core/auth/user-route-access.service';
import { EngagementComponent } from '../list/engagement.component';
import { EngagementDetailComponent } from '../detail/engagement-detail.component';
import { EngagementUpdateComponent } from '../update/engagement-update.component';
import { EngagementRoutingResolveService } from './engagement-routing-resolve.service';

const engagementRoute: Routes = [
  {
    path: '',
    component: EngagementComponent,
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/view',
    component: EngagementDetailComponent,
    resolve: {
      engagement: EngagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: 'new',
    component: EngagementUpdateComponent,
    resolve: {
      engagement: EngagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
  {
    path: ':id/edit',
    component: EngagementUpdateComponent,
    resolve: {
      engagement: EngagementRoutingResolveService,
    },
    canActivate: [UserRouteAccessService],
  },
];

@NgModule({
  imports: [RouterModule.forChild(engagementRoute)],
  exports: [RouterModule],
})
export class EngagementRoutingModule {}

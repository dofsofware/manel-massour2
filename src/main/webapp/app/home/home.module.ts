import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from 'app/shared/shared.module';
import { HOME_ROUTE } from './home.route';
import { HomeComponent } from './home.component';
import { FormsModule } from '@angular/forms';
import { ChangerpipePipeHome } from 'app/changerpipehome.pipe';

@NgModule({
  imports: [SharedModule, FormsModule, RouterModule.forChild([HOME_ROUTE])],
  declarations: [HomeComponent, ChangerpipePipeHome],
  providers: [ChangerpipePipeHome],
})
export class HomeModule {}

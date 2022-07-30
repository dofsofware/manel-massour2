import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
  imports: [
    RouterModule.forChild([
      {
        path: 'recherche',
        data: { pageTitle: 'buntuApp.recherche.home.title' },
        loadChildren: () => import('./recherche/recherche.module').then(m => m.RechercheModule),
      },
      {
        path: 'acheter',
        data: { pageTitle: 'buntuApp.acheter.home.title' },
        loadChildren: () => import('./acheter/acheter.module').then(m => m.AcheterModule),
      },
      {
        path: 'louer',
        data: { pageTitle: 'buntuApp.louer.home.title' },
        loadChildren: () => import('./louer/louer.module').then(m => m.LouerModule),
      },
      {
        path: 'estimer',
        data: { pageTitle: 'buntuApp.estimer.home.title' },
        loadChildren: () => import('./estimer/estimer.module').then(m => m.EstimerModule),
      },
      {
        path: 'contact',
        data: { pageTitle: 'buntuApp.contact.home.title' },
        loadChildren: () => import('./contact/contact.module').then(m => m.ContactModule),
      },
      {
        path: 'apropos',
        data: { pageTitle: 'buntuApp.apropos.home.title' },
        loadChildren: () => import('./apropos/apropos.module').then(m => m.AproposModule),
      },
      {
        path: 'propriete',
        data: { pageTitle: 'buntuApp.propriete.home.title' },
        loadChildren: () => import('./propriete/propriete.module').then(m => m.ProprieteModule),
      },
      {
        path: 'engagement',
        data: { pageTitle: 'buntuApp.engagement.home.title' },
        loadChildren: () => import('./engagement/engagement.module').then(m => m.EngagementModule),
      },
      /* jhipster-needle-add-entity-route - JHipster will add entity modules routes here */
    ]),
  ],
})
export class EntityRoutingModule {}

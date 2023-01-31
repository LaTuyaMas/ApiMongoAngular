import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SeriesListComponent} from "./components/series-list/series-list.component";

const routes: Routes = [
  {path: '', pathMatch: 'full', component: SeriesListComponent},
  {path: 'series', redirectTo: ''},
  {path: '**', redirectTo: '/series', pathMatch: 'full'}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

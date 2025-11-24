import { Routes } from '@angular/router';
import { Index } from '../module/index';
import { About } from '../module/about/about';
export const routes: Routes = [

{path: '', component: Index},
  { path: 'about', component: About },

];

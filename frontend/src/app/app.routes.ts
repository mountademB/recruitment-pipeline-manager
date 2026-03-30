import { Routes } from '@angular/router';
import { Dashboard } from './features/dashboard/dashboard';
import { CandidateList } from './features/candidates/candidate-list/candidate-list';
import { CandidateDetail } from './features/candidates/candidate-detail/candidate-detail';
import { CandidateForm } from './features/candidates/candidate-form/candidate-form';

export const routes: Routes = [
  { path: '', redirectTo: 'candidates', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'candidates', component: CandidateList },
  { path: 'candidates/new', component: CandidateForm },
  { path: 'candidates/:id/edit', component: CandidateForm },
  { path: 'candidates/:id', component: CandidateDetail }
];

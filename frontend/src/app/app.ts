import { Component } from '@angular/core';
import { RouterLink, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <nav class="topbar">
      <a routerLink="/dashboard">Dashboard</a>
      <a routerLink="/candidates">Candidates</a>
      <a routerLink="/candidates/new">New Candidate</a>
    </nav>

    <main class="page-shell">
      <router-outlet></router-outlet>
    </main>
  `
})
export class App {}

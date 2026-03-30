import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CandidateService } from '../../core/services/candidate.service';
import { DashboardSummary } from '../../core/models/dashboard-summary.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="content-card">
      <h2 class="section-title">Dashboard</h2>

      <p *ngIf="loading" class="muted">Loading dashboard...</p>
      <div *ngIf="error" class="alert alert-error">{{ error }}</div>

      <div *ngIf="summary && !loading" class="card-grid">
        <div class="stat-card">
          <h3>Total Candidates</h3>
          <p class="stat-value">{{ summary.totalCandidates }}</p>
        </div>

        <div class="stat-card">
          <h3>Applied</h3>
          <p class="stat-value">{{ summary.applied }}</p>
        </div>

        <div class="stat-card">
          <h3>Screened</h3>
          <p class="stat-value">{{ summary.screened }}</p>
        </div>

        <div class="stat-card">
          <h3>Interview</h3>
          <p class="stat-value">{{ summary.interview }}</p>
        </div>

        <div class="stat-card">
          <h3>Accepted</h3>
          <p class="stat-value">{{ summary.accepted }}</p>
        </div>

        <div class="stat-card">
          <h3>Rejected</h3>
          <p class="stat-value">{{ summary.rejected }}</p>
        </div>
      </div>
    </section>
  `
})
export class Dashboard implements OnInit {
  private candidateService = inject(CandidateService);

  summary: DashboardSummary | null = null;
  loading = true;
  error = '';

  ngOnInit(): void {
    this.candidateService.getDashboardSummary().subscribe({
      next: (data) => {
        this.summary = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load dashboard summary.';
        this.loading = false;
      }
    });
  }
}

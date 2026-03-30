import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { Candidate } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="toast-stack" *ngIf="successToast">
      <div class="toast toast-success">{{ successToast }}</div>
    </div>

    <section class="content-card">
      <h2 class="section-title">Candidates</h2>

      <div class="toolbar">
        <div class="field-group">
          <label for="stageFilter"><strong>Filter by stage</strong></label>
          <select id="stageFilter" [(ngModel)]="selectedStage" (change)="loadCandidates()">
            <option *ngFor="let stage of stageOptions" [value]="stage">{{ stage }}</option>
          </select>
        </div>

        <div class="field-group">
          <label for="searchBox"><strong>Search</strong></label>
          <input
            id="searchBox"
            type="text"
            [(ngModel)]="searchTerm"
            (keyup.enter)="loadCandidates()"
            placeholder="Search by name or email">
        </div>

        <div class="actions-row">
          <button type="button" (click)="loadCandidates()">Search</button>
          <button type="button" (click)="resetFilters()">Reset</button>
        </div>
      </div>

      <p *ngIf="loading" class="muted">Loading candidates...</p>
      <div *ngIf="error" class="alert alert-error">{{ error }}</div>

      <div class="table-wrap" *ngIf="!loading && candidates.length > 0">
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              <th>Position</th>
              <th>Stage</th>
              <th>View</th>
              <th>Edit</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let candidate of candidates">
              <td>{{ candidate.id }}</td>
              <td>{{ candidate.firstName }} {{ candidate.lastName }}</td>
              <td>{{ candidate.email }}</td>
              <td>{{ candidate.position }}</td>
              <td>
                <span class="badge" [ngClass]="'badge-' + candidate.stage">{{ candidate.stage }}</span>
              </td>
              <td><a [routerLink]="['/candidates', candidate.id]">Open</a></td>
              <td><a [routerLink]="['/candidates', candidate.id, 'edit']">Edit</a></td>
            </tr>
          </tbody>
        </table>
      </div>

      <p *ngIf="!loading && !error && candidates.length === 0" class="muted">No candidates found.</p>
    </section>
  `
})
export class CandidateList implements OnInit {
  private candidateService = inject(CandidateService);

  candidates: Candidate[] = [];
  loading = true;
  error = '';
  successToast = '';

  stageOptions: string[] = ['ALL', 'APPLIED', 'SCREENED', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];
  selectedStage = 'ALL';
  searchTerm = '';

  ngOnInit(): void {
    const flashMessage = sessionStorage.getItem('flashSuccess');
    if (flashMessage) {
      this.successToast = flashMessage;
      sessionStorage.removeItem('flashSuccess');
      setTimeout(() => {
        this.successToast = '';
      }, 2500);
    }

    this.loadCandidates();
  }

  loadCandidates(): void {
    this.loading = true;
    this.error = '';

    this.candidateService.getCandidates(this.selectedStage, this.searchTerm).subscribe({
      next: (data) => {
        this.candidates = data;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load candidates from backend.';
        this.loading = false;
      }
    });
  }

  resetFilters(): void {
    this.selectedStage = 'ALL';
    this.searchTerm = '';
    this.loadCandidates();
  }
}

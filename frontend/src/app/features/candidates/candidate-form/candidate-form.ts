import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { CandidateStage } from '../../../core/models/candidate.model';

@Component({
  selector: 'app-candidate-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <section class="content-card">
      <h2 class="section-title">{{ isEditMode ? 'Edit Candidate' : 'New Candidate' }}</h2>

      <p *ngIf="loading" class="muted">Loading candidate...</p>

      <form *ngIf="!loading" (ngSubmit)="submit()" #candidateForm="ngForm" class="form-grid">
        <div class="field-group">
          <label><strong>First name</strong></label>
          <input type="text" name="firstName" [(ngModel)]="model.firstName" required #firstNameModel="ngModel">
          <div *ngIf="firstNameModel.invalid && firstNameModel.touched" class="alert alert-error">First name is required.</div>
        </div>

        <div class="field-group">
          <label><strong>Last name</strong></label>
          <input type="text" name="lastName" [(ngModel)]="model.lastName" required #lastNameModel="ngModel">
          <div *ngIf="lastNameModel.invalid && lastNameModel.touched" class="alert alert-error">Last name is required.</div>
        </div>

        <div class="field-group">
          <label><strong>Email</strong></label>
          <input type="email" name="email" [(ngModel)]="model.email" required email #emailModel="ngModel">
          <div *ngIf="emailModel.errors?.['required'] && emailModel.touched" class="alert alert-error">Email is required.</div>
          <div *ngIf="emailModel.errors?.['email'] && emailModel.touched" class="alert alert-error">Enter a valid email address.</div>
        </div>

        <div class="field-group">
          <label><strong>Phone</strong></label>
          <input type="text" name="phone" [(ngModel)]="model.phone" required pattern="^\+?[0-9]{10,15}$" #phoneModel="ngModel">
          <div *ngIf="phoneModel.errors?.['required'] && phoneModel.touched" class="alert alert-error">Phone number is required.</div>
          <div *ngIf="phoneModel.errors?.['pattern'] && phoneModel.touched" class="alert alert-error">Phone must be 10 to 15 digits, optional leading +, and no spaces.</div>
        </div>

        <div class="field-group">
          <label><strong>Position</strong></label>
          <input type="text" name="position" [(ngModel)]="model.position" required #positionModel="ngModel">
          <div *ngIf="positionModel.invalid && positionModel.touched" class="alert alert-error">Position is required.</div>
        </div>

        <div class="field-group">
          <label><strong>Stage</strong></label>
          <select name="stage" [(ngModel)]="model.stage" required #stageModel="ngModel">
            <option *ngFor="let stage of stages" [value]="stage">{{ stage }}</option>
          </select>
          <div *ngIf="stageModel.invalid && stageModel.touched" class="alert alert-error">Stage is required.</div>
        </div>

        <div class="actions-row">
          <button type="submit" [disabled]="submitting || candidateForm.invalid">
            {{ isEditMode ? 'Update Candidate' : 'Create Candidate' }}
          </button>
        </div>
      </form>

      <div *ngIf="message" class="alert alert-success">{{ message }}</div>
      <div *ngIf="error" class="alert alert-error">{{ error }}</div>
    </section>
  `
})
export class CandidateForm implements OnInit {
  private candidateService = inject(CandidateService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  stages: CandidateStage[] = ['APPLIED', 'SCREENED', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];

  model = {
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    position: '',
    stage: 'APPLIED' as CandidateStage
  };

  candidateId: number | null = null;
  isEditMode = false;
  loading = false;
  submitting = false;
  message = '';
  error = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    if (id) {
      this.isEditMode = true;
      this.candidateId = id;
      this.loading = true;

      this.candidateService.getCandidateById(id).subscribe({
        next: (candidate) => {
          this.model = {
            firstName: candidate.firstName,
            lastName: candidate.lastName,
            email: candidate.email,
            phone: candidate.phone,
            position: candidate.position,
            stage: candidate.stage
          };
          this.loading = false;
        },
        error: () => {
          this.error = 'Failed to load candidate.';
          this.loading = false;
        }
      });
    }
  }

  submit(): void {
    this.submitting = true;
    this.message = '';
    this.error = '';

    if (this.isEditMode && this.candidateId) {
      this.candidateService.updateCandidate(this.candidateId, this.model).subscribe({
        next: (candidate) => {
          this.submitting = false;
          this.message = 'Candidate updated successfully.';
          this.router.navigate(['/candidates', candidate.id]);
        },
        error: (err) => {
          this.submitting = false;
          this.error = err?.error?.message || err?.error?.error || 'Failed to update candidate.';
        }
      });
      return;
    }

    this.candidateService.createCandidate(this.model).subscribe({
      next: (candidate) => {
        this.submitting = false;
        this.message = 'Candidate created successfully.';
        this.router.navigate(['/candidates', candidate.id]);
      },
      error: (err) => {
        this.submitting = false;
        this.error = err?.error?.message || err?.error?.error || 'Failed to create candidate.';
      }
    });
  }
}

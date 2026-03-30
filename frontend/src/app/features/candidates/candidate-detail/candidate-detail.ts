import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CandidateService } from '../../../core/services/candidate.service';
import { Candidate, CandidateStage } from '../../../core/models/candidate.model';
import { CandidateNote } from '../../../core/models/candidate-note.model';

@Component({
  selector: 'app-candidate-detail',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="toast-stack" *ngIf="noteSuccessToast || noteErrorToast">
      <div *ngIf="noteSuccessToast" class="toast toast-success">{{ noteSuccessToast }}</div>
      <div *ngIf="noteErrorToast" class="toast toast-error">{{ noteErrorToast }}</div>
    </div>

    <section *ngIf="loading" class="content-card">
      <p class="muted">Loading candidate...</p>
    </section>

    <section *ngIf="error" class="content-card">
      <div class="alert alert-error">{{ error }}</div>
    </section>

    <div *ngIf="candidate && !loading" class="detail-grid">
      <section class="content-card">
        <h2 class="section-title">Candidate Detail</h2>

        <p><strong>Name:</strong> {{ candidate.firstName }} {{ candidate.lastName }}</p>
        <p><strong>Email:</strong> {{ candidate.email }}</p>
        <p><strong>Phone:</strong> {{ candidate.phone }}</p>
        <p><strong>Position:</strong> {{ candidate.position }}</p>
        <p>
          <strong>Stage:</strong>
          <span class="badge" [ngClass]="'badge-' + candidate.stage">{{ candidate.stage }}</span>
        </p>

        <div class="actions-row" style="margin-top:16px;">
          <a [routerLink]="['/candidates', candidate.id, 'edit']">Edit Candidate</a>
          <button type="button" (click)="deleteCandidate()" [disabled]="deleting">
            {{ deleting ? 'Deleting...' : 'Delete Candidate' }}
          </button>
        </div>

        <div *ngIf="deleteError" class="alert alert-error">{{ deleteError }}</div>
      </section>

      <section class="content-card">
        <h3>Update Stage</h3>

        <div class="actions-row">
          <div class="field-group" style="min-width:240px;">
            <label><strong>Stage</strong></label>
            <select [(ngModel)]="selectedStage">
              <option *ngFor="let stage of stages" [value]="stage">{{ stage }}</option>
            </select>
          </div>

          <button (click)="updateStage()">Save Stage</button>
        </div>

        <div *ngIf="stageMessage" class="alert alert-success">{{ stageMessage }}</div>
      </section>

      <section class="content-card">
        <h3>Add Note</h3>

        <form (ngSubmit)="addNote()" class="form-grid">
          <div class="field-group">
            <label><strong>Author</strong></label>
            <input type="text" name="author" [(ngModel)]="noteAuthor" required>
          </div>

          <div class="field-group">
            <label><strong>Note</strong></label>
            <textarea name="content" [(ngModel)]="noteContent" rows="4" required></textarea>
          </div>

          <div class="actions-row">
            <button type="submit">Add Note</button>
          </div>
        </form>

        <div *ngIf="noteActionError" class="alert alert-error">{{ noteActionError }}</div>
      </section>

      <section class="content-card">
        <h3>Notes</h3>

        <p *ngIf="notes.length === 0" class="muted">No notes yet.</p>

        <div *ngFor="let note of notes" class="note-card">
          <div class="actions-row" style="justify-content:space-between;align-items:flex-start;">
            <p style="margin:0;"><strong>{{ note.author }}</strong> <span class="muted">- {{ note.createdAt }}</span></p>
            <button
              type="button"
              (click)="deleteNote(note.id)"
              [disabled]="deletingNoteId === note.id">
              {{ deletingNoteId === note.id ? 'Deleting...' : 'Delete Note' }}
            </button>
          </div>

          <p style="margin-top:12px;">{{ note.content }}</p>
        </div>
      </section>
    </div>
  `
})
export class CandidateDetail implements OnInit {
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private candidateService = inject(CandidateService);

  candidate: Candidate | null = null;
  notes: CandidateNote[] = [];
  loading = true;
  error = '';
  stageMessage = '';
  deleteError = '';
  noteActionError = '';
  deleting = false;
  deletingNoteId: number | null = null;

  noteSuccessToast = '';
  noteErrorToast = '';

  stages: CandidateStage[] = ['APPLIED', 'SCREENED', 'INTERVIEW', 'ACCEPTED', 'REJECTED'];
  selectedStage: CandidateStage = 'APPLIED';

  noteAuthor = 'Recruiter';
  noteContent = '';

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.error = 'Invalid candidate id.';
      this.loading = false;
      return;
    }

    this.loadCandidate(id);
    this.loadNotes(id);
  }

  showNoteSuccess(message: string): void {
    this.noteSuccessToast = message;
    this.noteErrorToast = '';
    setTimeout(() => {
      this.noteSuccessToast = '';
    }, 2200);
  }

  showNoteError(message: string): void {
    this.noteErrorToast = message;
    this.noteSuccessToast = '';
    setTimeout(() => {
      this.noteErrorToast = '';
    }, 2600);
  }

  loadCandidate(id: number): void {
    this.candidateService.getCandidateById(id).subscribe({
      next: (data) => {
        this.candidate = data;
        this.selectedStage = data.stage;
        this.loading = false;
      },
      error: () => {
        this.error = 'Failed to load candidate.';
        this.loading = false;
      }
    });
  }

  loadNotes(id: number): void {
    this.candidateService.getNotes(id).subscribe({
      next: (data) => {
        this.notes = data;
      },
      error: () => {
        this.notes = [];
      }
    });
  }

  updateStage(): void {
    if (!this.candidate) return;

    this.candidateService.updateCandidateStage(this.candidate.id, this.selectedStage).subscribe({
      next: (updated) => {
        this.candidate = updated;
        this.stageMessage = 'Stage updated successfully.';
      },
      error: () => {
        this.stageMessage = 'Failed to update stage.';
      }
    });
  }

  addNote(): void {
    if (!this.candidate || !this.noteAuthor.trim() || !this.noteContent.trim()) return;

    this.noteActionError = '';

    this.candidateService.addNote(this.candidate.id, this.noteContent, this.noteAuthor).subscribe({
      next: (note) => {
        this.notes = [note, ...this.notes];
        this.noteContent = '';
      },
      error: () => {
        this.noteActionError = 'Failed to add note.';
      }
    });
  }

  deleteNote(noteId: number): void {
    if (!this.candidate) return;

    const confirmed = window.confirm('Delete this note?');
    if (!confirmed) return;

    this.deletingNoteId = noteId;
    this.noteActionError = '';

    this.candidateService.deleteNote(this.candidate.id, noteId).subscribe({
      next: () => {
        this.notes = this.notes.filter(note => note.id !== noteId);
        this.deletingNoteId = null;
        this.showNoteSuccess('Note deleted successfully.');
      },
      error: () => {
        this.deletingNoteId = null;
        this.noteActionError = 'Failed to delete note.';
        this.showNoteError('Failed to delete note.');
      }
    });
  }

  deleteCandidate(): void {
    if (!this.candidate) return;

    const confirmed = window.confirm(`Delete candidate ${this.candidate.firstName} ${this.candidate.lastName}?`);
    if (!confirmed) return;

    this.deleting = true;
    this.deleteError = '';

    this.candidateService.deleteCandidate(this.candidate.id).subscribe({
      next: () => {
        sessionStorage.setItem('flashSuccess', 'Candidate deleted successfully.');
        this.router.navigate(['/candidates']);
      },
      error: () => {
        this.deleting = false;
        this.deleteError = 'Failed to delete candidate.';
      }
    });
  }
}

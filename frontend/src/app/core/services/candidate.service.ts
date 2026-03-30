import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Candidate, CandidateStage } from '../models/candidate.model';
import { CandidateNote } from '../models/candidate-note.model';
import { DashboardSummary } from '../models/dashboard-summary.model';

@Injectable({
  providedIn: 'root'
})
export class CandidateService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/candidates';
  private dashboardUrl = 'http://localhost:8080/api/dashboard';

  getCandidates(stage?: string, search?: string): Observable<Candidate[]> {
    let params = new HttpParams();

    if (stage && stage !== 'ALL') {
      params = params.set('stage', stage);
    }

    if (search && search.trim()) {
      params = params.set('search', search.trim());
    }

    return this.http.get<Candidate[]>(this.apiUrl, { params });
  }

  getCandidateById(id: number): Observable<Candidate> {
    return this.http.get<Candidate>(`${this.apiUrl}/${id}`);
  }

  createCandidate(payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    stage: CandidateStage;
  }): Observable<Candidate> {
    return this.http.post<Candidate>(this.apiUrl, payload);
  }

  updateCandidate(id: number, payload: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    position: string;
    stage: CandidateStage;
  }): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}`, payload);
  }

  updateCandidateStage(id: number, stage: CandidateStage): Observable<Candidate> {
    return this.http.put<Candidate>(`${this.apiUrl}/${id}/stage`, { stage });
  }

  deleteCandidate(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getNotes(candidateId: number): Observable<CandidateNote[]> {
    return this.http.get<CandidateNote[]>(`${this.apiUrl}/${candidateId}/notes`);
  }

  addNote(candidateId: number, content: string, author: string): Observable<CandidateNote> {
    return this.http.post<CandidateNote>(`${this.apiUrl}/${candidateId}/notes`, { content, author });
  }

  deleteNote(candidateId: number, noteId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${candidateId}/notes/${noteId}`);
  }

  getDashboardSummary(): Observable<DashboardSummary> {
    return this.http.get<DashboardSummary>(`${this.dashboardUrl}/summary`);
  }
}

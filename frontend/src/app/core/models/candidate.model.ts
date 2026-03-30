export type CandidateStage = 'APPLIED' | 'SCREENED' | 'INTERVIEW' | 'ACCEPTED' | 'REJECTED';

export interface Candidate {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  stage: CandidateStage;
  createdAt: string;
  updatedAt: string;
}

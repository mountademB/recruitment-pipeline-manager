# Recruitment Pipeline Manager

A full-stack recruitment workflow application built with **Spring Boot**, **Angular**, and **PostgreSQL**.

This project helps recruiters manage candidates through the hiring pipeline, track stage changes, add recruiter notes, search/filter candidates, and monitor overall pipeline health through a dashboard.

## Features

- Create candidates
- Edit candidate information
- Delete candidates
- View candidate details
- Move candidates between stages
- Add and delete recruiter notes
- Dashboard with counts by stage
- Filter candidates by stage
- Search candidates by name or email
- Frontend and backend validation for candidate data

## Candidate Stages

- APPLIED
- SCREENED
- INTERVIEW
- ACCEPTED
- REJECTED

## Tech Stack

### Backend
- Java
- Spring Boot
- Spring Data JPA
- PostgreSQL
- Maven

### Frontend
- Angular
- TypeScript
- HTML/CSS

### Database / Dev Tools
- PostgreSQL
- Docker Compose
- Git / GitHub

## Architecture

- **Frontend**: Angular SPA for recruiter workflows
- **Backend**: REST API built with Spring Boot
- **Database**: PostgreSQL for persistence
- **Docker Compose**: local database orchestration

## Project Structure

```text
recruitment-pipeline-manager/
├── backend/
├── frontend/
├── docker-compose.yml
├── .gitignore
└── README.md
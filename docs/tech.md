# Plataforma de Banco de Currículos

## Documento Técnico

---

# 1. Visão Geral

Este documento descreve a arquitetura técnica da plataforma de **Banco de Currículos SaaS**, incluindo estrutura do sistema, modelo de dados, fluxos principais e decisões tecnológicas.

O sistema será desenvolvido inicialmente como um **MVP escalável**, utilizando ferramentas gratuitas e arquitetura preparada para crescimento.

Principais objetivos técnicos:

- Simplicidade
- Segurança
- Escalabilidade futura
- Baixo custo inicial

---

# 2. Arquitetura do Sistema

O sistema seguirá uma arquitetura baseada em **Clean Architecture**, com separação clara de responsabilidades.

## Diagrama de Arquitetura

```mermaid
flowchart TD

User[Candidato / RH]
Frontend[Frontend Web - React / Next.js]

API[Backend API - .NET 8]

App[Application Layer]

Domain[Domain Layer]

Infra[Infrastructure Layer]

DB[(PostgreSQL)]

Storage[(Storage - Supabase)]

User --> Frontend
Frontend --> API
API --> App
App --> Domain
App --> Infra
Infra --> DB
Infra --> Storage
```

---

# 3. Estrutura do Backend

Estrutura de diretórios recomendada:

```
src/

Api
 Controllers
 Middleware

Application
 Services
 DTOs
 Validators

Domain
 Entities
 Interfaces

Infrastructure
 Repositories
 DbContext
 Storage

Shared
 Exceptions
 Utils
```

---

# 4. Stack Tecnológica

## Backend

- .NET 8 Web API
- Entity Framework Core
- FluentValidation
- JWT Authentication

---

## Frontend

- Next.js

---

## Banco de Dados

PostgreSQL

Opções gratuitas recomendadas:

- Supabase

---

## Armazenamento de Arquivos

Currículos serão armazenados em:

**Supabase Storage**

Formato permitido:

PDF apenas.

---

# 5. Modelo de Dados

## Diagrama ER

```mermaid
erDiagram

COMPANIES {
    uuid Id
    string Name
    datetime CreatedAt
}

USERS {
    uuid Id
    uuid CompanyId
    string Name
    string Email
    string PasswordHash
    string Role
    datetime CreatedAt
}

CANDIDATES {
    uuid Id
    uuid CompanyId
    string Name
    string Email
    string Phone
    string City
    string State
    string Seniority
    string ResumeUrl
    datetime CreatedAt
}

SKILLS {
    uuid Id
    string Name
}

CANDIDATE_SKILLS {
    uuid CandidateId
    uuid SkillId
}

COMPANIES ||--o{ USERS : has
COMPANIES ||--o{ CANDIDATES : owns
CANDIDATES ||--o{ CANDIDATE_SKILLS : has
SKILLS ||--o{ CANDIDATE_SKILLS : mapped
```

---

# 6. Multi-Tenancy

A plataforma será **multiempresa (multi-tenant)**.

Estratégia utilizada:

**Tenant por coluna**

Cada entidade terá:

```
CompanyId
```

Todas as queries devem incluir filtro:

```
WHERE CompanyId = {empresa_logada}
```

Isso garante isolamento lógico de dados.

---

# 7. Fluxo de Cadastro de Candidato

```mermaid
sequenceDiagram

participant Candidate
participant Frontend
participant API
participant Storage
participant Database

Candidate->>Frontend: Preenche formulário + envia PDF
Frontend->>API: POST /candidates

API->>API: Validação de dados
API->>API: Validação do arquivo PDF

API->>Storage: Upload do currículo
Storage-->>API: URL do arquivo

API->>Database: Salvar candidato
Database-->>API: OK

API-->>Frontend: Candidato cadastrado
```

---

# 8. Fluxo de Autenticação

```mermaid
sequenceDiagram

participant RH
participant Frontend
participant API
participant Database

RH->>Frontend: Login
Frontend->>API: POST /auth/login

API->>Database: Buscar usuário
Database-->>API: Dados do usuário

API->>API: Validar senha (BCrypt)

API->>API: Gerar JWT

API-->>Frontend: Token JWT

Frontend->>API: Requisições autenticadas
Note right of Frontend: Authorization: Bearer token
```

---

# 9. Fluxo de Busca de Candidatos

```mermaid
flowchart TD

RH[Usuário RH]
UI[Interface de busca]

API[API de busca]

DB[(Banco de dados)]

RH --> UI
UI --> API
API --> DB
DB --> API
API --> UI
UI --> RH
```

Filtros disponíveis:

- cidade
- senioridade
- skills

---

# 10. Upload de Currículo

Apenas arquivos **PDF** serão aceitos.

Validações obrigatórias:

- extensão `.pdf`
- MIME type `application/pdf`
- tamanho máximo: **5MB**

Fluxo:

1. candidato envia currículo
2. API valida arquivo
3. arquivo é enviado ao storage
4. URL salva no banco

Exemplo de caminho:

```
resumes/{candidateId}.pdf
```

---

# 11. Segurança

Medidas iniciais implementadas:

### Hash de senha

```
BCrypt
```

---

### Autorização

JWT + Roles

Roles disponíveis:

```
Admin
HR
```

Uso no backend:

```
[Authorize(Roles="HR,Admin")]
```

---

### Rate Limit

Para evitar spam de currículos:

```
AspNetCoreRateLimit
```

---

### Validação de arquivos

Evitar upload malicioso:

- validar MIME
- validar extensão
- limitar tamanho

---

# 12. Índices de Banco

Índices recomendados:

Candidates:

```
index email
index city
index seniority
index companyId
```

CandidateSkills:

```
index candidateId
index skillId
```

---

# 13. Deploy

Arquitetura de deploy:

```mermaid
flowchart TD

User[Usuário]

Vercel[Vercel - Frontend]

Render[Render - API]

Supabase[(Supabase PostgreSQL)]

Storage[(Supabase Storage)]

User --> Vercel
Vercel --> Render
Render --> Supabase
Render --> Storage
```

---

# 14. Roadmap Técnico

## V1 – MVP

- Cadastro de candidatos
- Upload de currículo
- Busca simples
- Multiempresa
- Autenticação

---

## V2 – Melhorias

- Busca por texto no currículo
- Paginação
- Melhor UX

---

## V3 – Inteligência

- IA para análise de currículos
- Ranking automático
- Matching de vagas
- Pipeline de recrutamento
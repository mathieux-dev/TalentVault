# GitHub Copilot Instructions — TalentVault

Este arquivo define **regras de geração de código para o GitHub Copilot (modo Planning)** no projeto **TalentVault**.
O objetivo é garantir que todo código gerado siga **arquitetura, padrões e tecnologias definidos nas documentações do projeto**.

Copilot deve **sempre respeitar estas regras ao gerar código**.

---

# 1. Visão Geral do Projeto

TalentVault é uma **plataforma SaaS de banco de currículos**.

Permite que:

* Candidatos enviem currículos em **PDF**
* Empresas pesquisem e gerenciem candidatos
* RH visualize e baixe currículos

O sistema é **multi-tenant**, ou seja, várias empresas usam o mesmo sistema com isolamento de dados.

---

# 2. Stack Tecnológica

## Backend

Utilizar exclusivamente:

* .NET 8
* ASP.NET Core Web API
* Entity Framework Core
* PostgreSQL
* FluentValidation
* BCrypt.Net
* JWT Authentication

Arquitetura:

Clean Architecture.

---

## Frontend

Utilizar exclusivamente:

* Next.js
* TypeScript
* TailwindCSS
* React Query
* Axios
* React Hook Form
* Zod

---

# 3. Arquitetura Backend

O backend deve seguir **Clean Architecture**.

Estrutura obrigatória:

```
src/

TalentVault.Api
TalentVault.Application
TalentVault.Domain
TalentVault.Infrastructure
TalentVault.Shared
```

Responsabilidades:

Api

* Controllers
* Middlewares
* Configurações

Application

* Services
* DTOs
* Validators
* Interfaces

Domain

* Entities
* Regras de negócio

Infrastructure

* Repositories
* DbContext
* Storage

Shared

* Exceptions
* Result pattern

---

# 4. Regras Importantes de Backend

Copilot **NUNCA deve**:

* colocar regras de negócio em controllers
* acessar DbContext diretamente em controllers
* expor entidades diretamente na API
* misturar camadas da arquitetura

Fluxo correto:

```
Controller
   ↓
Service
   ↓
Repository
```

---

# 5. Entidades do Sistema

Entidades principais:

```
Company
User
Candidate
Skill
CandidateSkill
```

Todas entidades devem utilizar:

```
Guid Id
```

---

# 6. Multi-Tenancy

O sistema é **multiempresa**.

Todas entidades devem possuir:

```
CompanyId
```

Todas consultas devem filtrar:

```
CompanyId = empresa logada
```

O CompanyId deve vir do **JWT token**.

---

# 7. Upload de Currículo

Currículos devem seguir regras:

* apenas PDF
* máximo 5MB

Validações obrigatórias:

```
content-type: application/pdf
extension: .pdf
```

Arquivos devem ser armazenados em:

```
resumes/{candidateId}.pdf
```

Storage utilizado:

Supabase Storage.

---

# 8. Autenticação

Utilizar **JWT Authentication**.

Claims obrigatórias:

```
userId
companyId
role
```

Roles possíveis:

```
Admin
HR
```

---

# 9. Padrão de Resposta da API

Todas respostas devem seguir padrão:

```
{
  "success": true,
  "data": {},
  "errors": []
}
```

Erro:

```
{
  "success": false,
  "errors": ["message"]
}
```

---

# 10. Convenções de Código Backend

Seguir:

* SOLID
* Dependency Injection
* Async/Await
* Services stateless

Regras:

* métodos pequenos
* classes focadas
* DTOs para comunicação externa

---

# 11. API Routing

Todos endpoints devem usar prefixo:

```
/api/v1
```

Exemplos:

```
POST /api/v1/auth/login
POST /api/v1/candidates
GET  /api/v1/candidates
GET  /api/v1/candidates/{id}
```

---

# 12. Paginação

Endpoints de listagem devem aceitar:

```
page
pageSize
```

Resposta esperada:

```
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 120
}
```

---

# 13. Frontend Architecture

O frontend utiliza **Next.js + TypeScript**.

Estrutura obrigatória:

```
src/

app
components
features
hooks
services
types
utils
```

---

# 14. Organização por Features

Cada domínio deve possuir sua própria pasta.

Exemplo:

```
features/

auth
candidates
dashboard
```

---

# 15. Comunicação com API

Utilizar **Axios**.

Configuração centralizada em:

```
services/api.ts
```

Base URL:

```
/api/v1
```

---

# 16. Data Fetching

Utilizar **React Query**.

Criar hooks como:

```
useCandidates()
useCandidate()
useCreateCandidate()
```

---

# 17. Formulários

Formulários devem utilizar:

* React Hook Form
* Zod

Validações client-side devem existir.

---

# 18. Upload de Currículo

Upload deve aceitar apenas:

```
PDF
```

Validações:

* tamanho
* extensão

---

# 19. Componentes Reutilizáveis

Criar componentes em:

```
components/ui
```

Componentes básicos:

```
Button
Input
Select
Modal
Table
Card
```

---

# 20. Rotas da Aplicação

Principais rotas:

```
/login
/dashboard
/candidates
/candidates/new
/candidates/[id]
```

---

# 21. Autenticação Frontend

Fluxo:

```
login → receber JWT → armazenar token → enviar token nas requisições
```

Token deve ser enviado em:

```
Authorization: Bearer {token}
```

---

# 22. UX

Interface deve priorizar:

* simplicidade
* clareza
* velocidade

Evitar complexidade desnecessária no MVP.

---

# 23. Princípios Gerais

O código gerado deve sempre seguir:

* Clean Architecture
* SOLID
* Separation of Concerns
* Simplicidade
* Código legível

---

# 24. Objetivo do MVP

Copilot deve priorizar **simplicidade e estabilidade**.

O MVP deve incluir apenas:

* autenticação
* cadastro de candidatos
* upload de currículo
* busca de candidatos
* multiempresa

Funcionalidades avançadas ficam para versões futuras.

# TalentVault Backend Development Guide

## 1. Objetivo

Este documento define os padrões de desenvolvimento do backend da plataforma **TalentVault**.

O objetivo é garantir:

* Consistência de código
* Arquitetura escalável
* Segurança
* Facilidade de manutenção
* Integração eficiente com o frontend

---

# 2. Stack Tecnológica

O backend será desenvolvido utilizando:

* **.NET 8**
* **ASP.NET Core Web API**
* **Entity Framework Core**
* **PostgreSQL**
* **FluentValidation**
* **BCrypt.Net**
* **JWT Authentication**

Infraestrutura:

* Supabase PostgreSQL
* Supabase Storage (currículos)
* Deploy: Render ou Fly.io

---

# 3. Arquitetura

O projeto seguirá **Clean Architecture**.

Camadas:

```
Api
Application
Domain
Infrastructure
Shared
```

Responsabilidades:

### Api

Responsável por:

* Controllers
* Middlewares
* Configuração de autenticação
* Configuração de DI

---

### Application

Contém:

* Services
* UseCases
* DTOs
* Validators
* Interfaces de repositório

Nenhuma dependência de infraestrutura.

---

### Domain

Contém:

* Entities
* ValueObjects
* Regras de negócio

Não depende de nenhuma outra camada.

---

### Infrastructure

Contém:

* Repositories
* DbContext
* Integração com storage
* Configuração do banco

---

### Shared

Contém:

* Exceptions
* Helpers
* Constantes
* Result Pattern

---

# 4. Estrutura de Pastas

```
src/

TalentVault.Api
TalentVault.Application
TalentVault.Domain
TalentVault.Infrastructure
TalentVault.Shared
```

---

# 5. Entidades de Domínio

Entidades principais:

```
Company
User
Candidate
Skill
CandidateSkill
```

Para recebimento público de currículos, `Company` também possui um `Slug` único.

Todos os modelos devem utilizar **UUID** como chave primária.

Exemplo:

```
Id : Guid
```

---

# 6. Multi-Tenancy

A plataforma é **multiempresa**.

Todas as entidades relevantes devem possuir:

```
CompanyId
```

As queries devem sempre filtrar:

```
WHERE CompanyId = currentCompany
```

O CompanyId será extraído do token JWT.

No fluxo público de candidatura, a empresa é resolvida por `Slug` na rota.

---

# 7. Controllers

Controllers devem ser **finos**.

Eles devem apenas:

* validar request
* chamar services
* retornar response

Exemplo:

```
Controller -> Service -> Repository
```

Controllers não devem conter regras de negócio.

---

# 8. DTOs

Todos endpoints devem utilizar DTOs.

Nunca expor entidades diretamente.

Tipos de DTO:

```
CreateCandidateRequest
CandidateResponse
UpdateCandidateRequest
```

---

# 9. Validação

Validações serão feitas com:

**FluentValidation**

Exemplo:

```
CreateCandidateValidator
```

Validações incluem:

* campos obrigatórios
* formato de email
* tamanho de texto
* validação de arquivo

---

# 10. Upload de Currículo

Regras obrigatórias:

* apenas **PDF**
* tamanho máximo: **5MB**

Validações:

```
Content-Type: application/pdf
Extension: .pdf
```

Fluxo:

```
Upload → Validação → Storage → Salvar URL
```

Arquivos serão armazenados em:

```
{candidateId}.pdf
```

Também existe um endpoint público de candidatura com multipart/form-data, responsável por criar o candidato e salvar o PDF no storage:

```
POST /api/v1/public/applications/{companySlug}
```

Campos esperados:

```
name
email
phone
city
state
seniority
file
```

---

# 11. Autenticação

Sistema utilizará **JWT**.

Fluxo:

```
Login → valida credenciais → gera JWT
```

Claims obrigatórias:

```
userId
companyId
role
```

Roles disponíveis:

```
Admin
HR
```

O endpoint público de candidatura não exige autenticação.

---

# 12. Autorização

Utilizar attribute:

```
[Authorize]
```

Ou:

```
[Authorize(Roles = "Admin")]
```

---

# 13. Padrão de Resposta da API

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

# 14. Paginação

Endpoints de listagem devem suportar:

```
page
pageSize
```

Response:

```
{
  "items": [],
  "page": 1,
  "pageSize": 20,
  "total": 120
}
```

---

# 15. Logging

Utilizar logging padrão do ASP.NET.

Logs importantes:

* autenticação
* upload de arquivos
* erros de API

---

# 16. Rate Limiting

Endpoints públicos devem ter proteção contra spam.

Utilizar:

```
AspNetCoreRateLimit
```

---

# 17. Padrões de Código

Regras:

* métodos pequenos
* services stateless
* async/await sempre
* nunca acessar DbContext diretamente em controllers

---

# 18. Testes (futuro)

Testes planejados:

* Unit Tests
* Integration Tests

Framework sugerido:

```
xUnit
```

---

# 19. Versionamento da API

Prefixo obrigatório:

```
/api/v1
```

Exemplo:

```
POST /api/v1/auth/login
POST /api/v1/candidates
GET  /api/v1/candidates
```

---

# 20. Princípios obrigatórios

Seguir:

* Clean Architecture
* SOLID
* Separation of Concerns
* Dependency Injection

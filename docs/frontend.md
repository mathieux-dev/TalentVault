# TalentVault Frontend Development Guide

## 1. Objetivo

Este documento define os padrões de desenvolvimento do frontend da plataforma **TalentVault**.

O objetivo é garantir:

* código consistente
* boa experiência do usuário
* integração eficiente com o backend

---

# 2. Stack Tecnológica

Frontend será desenvolvido utilizando:

* **Next.js**
* **TypeScript**
* **TailwindCSS**
* **React Query**
* **Axios**
* **Zod**

Hospedagem:

* Vercel

---

# 3. Estrutura do Projeto

Estrutura recomendada:

```
src/

app
components
features
services
hooks
types
utils
```

---

# 4. Organização por Features

Cada domínio deve ter sua própria pasta.

Exemplo:

```
features/

auth
candidates
dashboard
```

---

# 5. Tipagem

Todos os dados vindos da API devem possuir tipos TypeScript.

Exemplo:

```
Candidate
CreateCandidateRequest
CandidateResponse
```

Esses tipos devem refletir os DTOs do backend.

---

# 6. Comunicação com API

A comunicação com a API será feita utilizando:

```
Axios
```

Configuração centralizada em:

```
services/api.ts
```

Exemplo de baseURL:

```
/api/v1
```

---

# 7. Data Fetching

Utilizar **React Query**.

Exemplo:

```
useCandidates()
useCreateCandidate()
```

Benefícios:

* cache automático
* revalidação
* loading states

---

# 8. Gerenciamento de Estado

Estado global mínimo.

Preferência:

* React Query
* Context API

Evitar Redux neste MVP.

---

# 9. Autenticação

Fluxo:

```
login → recebe JWT → salva token → envia token nas requisições
```

Armazenamento do token:

```
httpOnly cookie (preferencial)
```

ou:

```
localStorage
```

O formulário público de candidatura não exige autenticação.

---

# 10. Estrutura de Componentes

Separação clara:

```
components/ui
components/forms
components/layout
```

---

# 11. Formulários

Utilizar:

```
React Hook Form
Zod
```

Validação client-side.

---

# 12. Upload de Currículo

Upload deve permitir apenas:

```
PDF
```

Validações no frontend:

* extensão
* tamanho máximo

O envio público de currículo deve usar `multipart/form-data` e apontar para a rota pública da empresa:

```
/apply/[companySlug]
```

---

# 13. Páginas Principais

Aplicação terá:

```
/login
/dashboard
/candidates
/candidates/new
/candidates/[id]
/apply/[companySlug]
```

---

# 14. Estilo

Utilizar:

```
TailwindCSS
```

Padrões:

* layout simples
* responsivo
* foco em produtividade

---

# 15. Tratamento de Erros

Todos erros da API devem ser exibidos ao usuário.

Utilizar:

* toast notifications
* mensagens claras

---

# 16. Componentes Reutilizáveis

Criar componentes base:

```
Button
Input
Select
Modal
Table
Card
```

---

# 17. Performance

Boas práticas:

* lazy loading
* evitar re-renderizações
* uso correto de React Query cache

---

# 18. Segurança

Boas práticas:

* nunca expor secrets
* sanitizar dados
* proteger rotas autenticadas

---

# 19. Rotas Protegidas

Usuários não autenticados devem ser redirecionados para:

```
/login
```

---

# 20. UX

Interface deve priorizar:

* simplicidade
* rapidez
* clareza de informação

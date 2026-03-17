# Plataforma de Banco de Currículos (SaaS)

## Documento de Negócio

## 1. Visão do Produto

A plataforma tem como objetivo fornecer um **banco de currículos centralizado para empresas**, permitindo que candidatos enviem seus currículos e que equipes de RH possam pesquisar e gerenciar esses candidatos de forma simples e eficiente.

O sistema será construído inicialmente como um **MVP (Minimum Viable Product)** utilizando ferramentas gratuitas, com possibilidade de expansão futura para uma plataforma SaaS mais robusta.

---

# 2. Problema

Muitas empresas pequenas e médias não possuem um sistema estruturado para gerenciar currículos recebidos.

Normalmente os currículos chegam através de:

- Email
- WhatsApp
- Formulários simples
- Redes sociais

Isso gera problemas como:

- Perda de currículos
- Dificuldade de busca
- Falta de organização
- Retrabalho em processos seletivos

---

# 3. Solução

Uma plataforma simples onde:

**Candidatos**

- Enviam seus currículos em PDF
- Informam dados básicos
- Ficam disponíveis em um banco de talentos

**RH**

- Pesquisa candidatos
- Filtra por critérios
- Visualiza e baixa currículos

---

# 4. Público-alvo

Inicialmente:

- Pequenas empresas
- Escritórios
- Agências de recrutamento
- Startups
- Empresas sem ATS (Applicant Tracking System)

---

# 5. Proposta de Valor

A plataforma oferece:

- Centralização de currículos
- Busca rápida de candidatos
- Organização do banco de talentos
- Simplicidade de uso
- Baixo custo de implementação

---

# 6. Funcionalidades do MVP

## Para candidatos

Cadastro com:

- Nome
- Email
- Telefone
- Cidade
- Senioridade
- Upload de currículo (PDF)

Funcionalidades:

- Envio de currículo por formulário público
- Sem necessidade de criar conta no MVP
- Reenvio tratado como novo cadastro no MVP

---

## Para RH

- Login no sistema
- Busca de candidatos
- Filtros de busca
- Visualização de perfil
- Download do currículo

Filtros disponíveis:

- Skills
- Cidade
- Senioridade

---

## Administração

- Cadastro de empresa
- Criação de usuários de RH
- Controle de acesso

---

# 7. Modelo SaaS (multiempresa)

A plataforma será **multi-tenant**, permitindo que várias empresas utilizem o mesmo sistema.

Cada empresa terá:

- Usuários próprios
- Banco de candidatos separado
- Link público próprio para recebimento de currículos

Isolamento feito via:

CompanyId nos registros.

---

# 8. Diferenciais futuros

Possíveis evoluções:

- Busca por conteúdo dentro do currículo
- Análise automática de currículo com IA
- Sistema de vagas
- Pipeline de recrutamento
- Ranking automático de candidatos
- Integração com LinkedIn

---

# 9. Modelo de monetização (futuro)

Possibilidades:

Plano Básico

- Banco de currículos
- Busca simples

Plano Profissional

- Busca avançada
- Automação de triagem

Plano Enterprise

- IA de recrutamento
- Integrações

---

# 10. Indicadores de sucesso

Métricas importantes:

- Número de empresas cadastradas
- Currículos cadastrados
- Pesquisas realizadas por RH
- Tempo médio de contratação

---

# 11. Roadmap inicial

Fase 1 – MVP

- Cadastro de candidatos
- Upload de currículo
- Busca simples

Fase 2 – Melhorias

- Busca avançada
- Melhor UX

Fase 3 – Expansão

- IA para análise de currículos
- Gestão de vagas
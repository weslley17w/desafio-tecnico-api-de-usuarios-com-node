# 🚀 Desafio Técnico - API de Usuários com Node.js

## 📋 Objetivo

Desenvolver uma API RESTful completa para gerenciamento de usuários utilizando _Node.js, \*\*Express_ e _PostgreSQL_, incluindo sistema de autenticação e CRUD de usuários.

---

## 🎯 Requisitos Funcionais

### 1. CRUD de Usuários

- Criar
- Listar
- Atualizar
- Deletar

---

## 🔧 Requisitos Técnicos

### Stack Obrigatória

- Node.js (versão 16 ou superior)
- Express.js (framework web)
- JWT (autenticação)
- Typescript

---

## 🔐 Especificações de Segurança

### Autenticação

- Senhas devem ser hashadas
- JWT com expiração de 24 horas
- Refresh token com expiração de 7 dias
- Rate limiting: máximo _5 tentativas de login por IP a cada 15 minutos_

### Validação de Senha

A senha deve conter no mínimo _8 caracteres_, incluindo:

- 1 letra maiúscula
- 1 letra minúscula
- 1 número
- 1 caractere especial

---

## 📋 Critérios de Avaliação

### ✅ Funcionalidade

- Todas as rotas funcionam corretamente
- CRUD completo implementado
- Sistema de login/logout funcional

### 🧠 Código

- Código limpo e bem estruturado
- Uso adequado de middlewares
- Separação de responsabilidades
- Tratamento de erros consistente

### 🔒 Segurança

- Senhas hashadas corretamente
- JWT implementado adequadamente
- Validação de entrada

### 📝 Documentação

- README.md completo

---

## 🏆 Diferenciais (Pontos Extras)

### 🚀 Implementações Avançadas

- Paginação nas listagens
- Filtros e busca de usuários
- Soft delete de usuários
- Autorização de rotas

### 🧹 Qualidade de Código

- ESLint configurado
- Prettier para formatação

---

## ⏰ Prazo de Entrega

_5 dias úteis_ a partir do recebimento do desafio.

---

Boa sorte e bom desenvolvimento! 🚀

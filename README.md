# Desafio Técnico: API de Usuários e Produtos com Node.js

Esta é uma API RESTful para gerenciamento e autenticação de usuários e prudutos, desenvolvida como parte de um desafio técnico.

## Tecnologias

- _Node.js_
- _TypeScript_
- _Express_
- Autenticação com _JSON Web Token (JWT)_
- _PostgreSQL_
- _Redis_

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas em sua máquina:

- _Node.js:_ versão _v22.x_ ou superior.
- _NPM_.
- _Docker_.

## Configuração do Ambiente

1.  Na raiz do projeto, renomeie o arquivo .env.example para .env.

```bash
    mv .env.example .env
```

2.  Abra o arquivo .env e preencha as variáveis necessárias.

## 🚀 Como Rodar a Aplicação

Siga os passos abaixo para executar o projeto localmente.

1.  _Clone o repositório:_

```bash
  git clone https://github.com/weslley17w/desafio-tecnico-api-de-usuarios-com-node.git
  cd desafio-tecnico-api-de-usuarios-com-node
```

2.  _Rode o docker:_

```bash
  docker compose build
  docker compose up
```

Por padrão servidor estará rodando na porta 3000

## 📄 Documentação

A documentação completa da API pode ser consultada [neste site](https://weslley17w.github.io/desafio-tecnico-api-de-usuarios-com-node/).

## Collection do Postman

Você pode importar a collection do Postman para testar a API. A collection está localizada **[aqui](https://raw.githubusercontent.com/weslley17w/desafio-tecnico-api-de-usuarios-com-node/refs/heads/main/Desafio%20T%C3%A9cnico%20-%20API%20de%20Usu%C3%A1rios%20com%20Node.js.postman_collection.json)**.

# Desafio Técnico: API de Usuários com Node.js

Esta é uma API RESTful para gerenciamento e autenticação de usuários, desenvolvida como parte de um desafio técnico.

Para mais detalhes sobre os requisitos e especificações completas do desafio, por favor, consulte o arquivo:

**[➡️ DESAFIO.MD](DESAFIO.md)**

## Tecnologias

- _Node.js_
- _TypeScript_
- _Express_
- Autenticação com _JSON Web Token (JWT)_
- Banco de dados em memória
- Rate Limiting

## Pré-requisitos

Antes de começar, garanta que você tenha as seguintes ferramentas instaladas em sua máquina:

- _Node.js:_ versão _v22.x_ ou superior.
- _NPM_.

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

2.  _Instale as dependências:_

```bash
  npm install
```

3.  _Inicie o servidor de desenvolvimento:_

```bash
    npm run dev
```

Por padrão servidor estará rodando na porta 3000

## Scripts

- npm run dev
  - Inicia o servidor em modo de desenvolvimento usando ts-node-dev.

- npm run watch
  - Inicia o servidor em modo de desenvolvimento com _recarga automática (hot-reload)_.

- npm run build
  - Transpila o projeto

- npm run start
  - Inicia o servidor

- npm run loadtest
  - Roda o teste de carga

## Collection do Postman

Você pode importar a collection do Postman para testar a API. A collection está localizada **[aqui](https://raw.githubusercontent.com/weslley17w/desafio-tecnico-api-de-usuarios-com-node/refs/heads/main/Desafio%20T%C3%A9cnico%20-%20API%20de%20Usu%C3%A1rios%20com%20Node.js.postman_collection.json?token=GHSAT0AAAAAADHKUAEAYCUKU6D255EF2HEM2DZD3PQ)**.

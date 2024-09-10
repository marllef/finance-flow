# Sistema de Gestão de Transações Financeiras

Autor: [Marllef H. A. Freitas](https://github.com/marllef)

O Sistema de Gestão de Transações Financeiras é um backend desenvolvido em `NestJS` + `Prisma` com `PostgreSQL` para simular o gerenciamento eficiente de contas e transações financeiras.

## Features
- [x] Autenticação JWT
- [x] Autorização (User/Admin)
- [x] Gerenciamento de contas (Criação, extrato, listagem de contas, ativação/desativação, exclusão, verificação de saldo individual)
- [x] Operações (Saques, Depósitos, Transferencias)
- [x] Relatórios agregados com filtros (Resumido ou Detalhado)
- [x] Limite de transações por minuto(5/min);
- [x] Script de configuração e migração de banco de dados;

## Requisitos

São requisitos para executar este projeto:

- `Docker`
- `Docker Compose`
- `Yarn`
- `NodeJS`

## Documentação

Neste repositório, você pode encontrar uma collection Postman com as principais chamadas API [clicando aqui](/docs/api.postman_collection.json).


## Executando localmente

Para iniciar o projeto, use os seguintes comandos:
1. Clone esse repositório em sua máquina local:

```sh
git clone https://github.com/marllef/finance-flow.git
```

2. Execute o script `deploy.sh`:

```sh
chmod +x deploy.sh && ./deploy.sh --seed
```
- Esse script irá fazer todas as configurações necessárias para que a aplicação execute corretamente.

- Para facilitar a execução, será criado um arquivo `.env` baseado no arquivo `.env.example`. Dessa forma, se quiser alterar alguma configuração, basta alterar o arquivo `.env.example` e executar o script novamente para realizar as alterações.

## Executando manualmente (Opcional)

Caso necessário, você pode executar manualmente a aplicação seguindo esses passos:

1. Crie um arquivo `.env` baseado no `.env.example`;

2. Execute o seguinte comando para subir a aplicação:
``` sh  
sudo docker-compose up -d --build
```

3. Execute o seguinte comando para fazer o seed do banco de dados:
``` sh 
sudo docker-compose exec server npx prisma db seed
```

- As migrations do banco de dados são executadas automaticamente.


## Testes unitários e E2E (Opcional)

As rotas mais criticas dessa aplicação estão cobertas por testes. Para executá-los, execute o seguinte comando:
``` sh
yarn test --verbose
```

Os testes End-to-End podem ser executados com o seguinte comando:
``` sh
yarn test:e2e
```

## Informações úteis

- Para testar a API, você poderá utilizar o [Postman](https://www.postman.com/)
- Alguns usuários foram criados automaticamente para serem utilizados nos testes, são eles:
  - ADMIN (Administrador)
    - Administrador: admin@example.com | Senha: 1234
  - USER (Usuário Comum)
    - Usuário 1: user.one@example.com | Senha: 1234
    - Usuário 2: user.two@example.com | Senha: 1234
    - Usuário 3: user.three@example.com | Senha: 1234